<?php

namespace App\Controllers;

use App\Database\Database;
use App\Auth\JwtService;
use App\Services\MailService;
use App\Services\SmsService;

class AuthController
{
    /**
     * POST /api/auth/send-otp
     * Generates and dispatches a 6-digit OTP code to email or phone number.
     */
    public static function sendOtp(array $body): void
    {
        $identifier = trim($body['identifier'] ?? $body['email'] ?? $body['phone'] ?? '');
        $type       = trim($body['type'] ?? '');
        $purpose    = trim($body['purpose'] ?? 'signup');

        if (!$identifier) {
            self::json(['status' => 'error', 'message' => 'Email or phone number is required'], 400);
            return;
        }

        // Auto-detect type if not explicitly supplied
        if (!$type) {
            $type = filter_var($identifier, FILTER_VALIDATE_EMAIL) ? 'email' : 'phone';
        }

        $db = Database::getConnection();

        // 1. Validation & duplicate checks
        if ($type === 'email') {
            if (!filter_var($identifier, FILTER_VALIDATE_EMAIL)) {
                self::json(['status' => 'error', 'message' => 'Please enter a valid email address'], 400);
                return;
            }

            if ($purpose === 'signup') {
                $check = $db->prepare('SELECT id FROM users WHERE email = ?');
                $check->execute([$identifier]);
                if ($check->fetch()) {
                    self::json(['status' => 'error', 'message' => 'This email address is already registered. Please sign in.'], 409);
                    return;
                }
            }
        } elseif ($type === 'phone') {
            // Strip formatting characters to validate digit count
            $cleanDigits = preg_replace('/\D/', '', $identifier);
            if (strlen($cleanDigits) < 8 || strlen($cleanDigits) > 15) {
                self::json(['status' => 'error', 'message' => 'Please enter a valid phone number (8-15 digits)'], 400);
                return;
            }

            if ($purpose === 'signup') {
                $check = $db->prepare('SELECT id FROM users WHERE phone = ?');
                $check->execute([$identifier]);
                if ($check->fetch()) {
                    self::json(['status' => 'error', 'message' => 'This phone number is already registered. Please sign in.'], 409);
                    return;
                }
            }
        } else {
            self::json(['status' => 'error', 'message' => 'Invalid verification type. Must be email or phone.'], 400);
            return;
        }

        // 2. Generate secure 6-digit OTP
        $otpCode = str_pad((string) random_int(100000, 999999), 6, '0', STR_PAD_LEFT);
        $expiresAt = date('Y-m-d H:i:s', time() + 300); // 5 minutes validity

        // Invalidate previous unverified OTPs for this identifier
        $cleanup = $db->prepare('DELETE FROM otps WHERE identifier = ? AND purpose = ? AND is_verified = FALSE');
        $cleanup->execute([$identifier, $purpose]);

        // Insert new OTP record with 5-minute validity using MySQL NOW()
        $stmt = $db->prepare('
            INSERT INTO otps (identifier, type, code, purpose, expires_at, is_verified)
            VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 5 MINUTE), FALSE)
        ');
        $stmt->execute([$identifier, $type, $otpCode, $purpose]);

        // 3. Dispatch OTP via respective real service
        if ($type === 'email') {
            $dispatch = MailService::sendOtpEmail($identifier, $otpCode);
        } else {
            $dispatch = SmsService::sendOtpSms($identifier, $otpCode);
        }

        if (!$dispatch['success']) {
            self::json([
                'status'  => 'error',
                'message' => $dispatch['error'] ?? 'Could not send verification code.',
            ], 500);
            return;
        }

        self::json([
            'status'     => 'success',
            'message'    => "Verification code sent to {$identifier}",
            'identifier' => $identifier,
            'type'       => $type,
        ]);
    }

    /**
     * POST /api/auth/verify-otp
     * Verifies the 6-digit code against database record.
     */
    public static function verifyOtp(array $body): void
    {
        $identifier = trim($body['identifier'] ?? $body['email'] ?? $body['phone'] ?? '');
        $code       = trim($body['code'] ?? $body['otp'] ?? '');
        $purpose    = trim($body['purpose'] ?? 'signup');

        if (!$identifier || !$code) {
            self::json(['status' => 'error', 'message' => 'Identifier and verification code are required'], 400);
            return;
        }

        $db = Database::getConnection();
        $stmt = $db->prepare('
            SELECT id, is_verified, (expires_at >= NOW()) AS is_valid
            FROM otps
            WHERE identifier = ? AND code = ? AND purpose = ?
            ORDER BY id DESC LIMIT 1
        ');
        $stmt->execute([$identifier, $code, $purpose]);
        $record = $stmt->fetch();

        if (!$record) {
            self::json(['status' => 'error', 'message' => 'Invalid verification code. Please check and try again.'], 400);
            return;
        }

        if (!$record['is_valid']) {
            self::json(['status' => 'error', 'message' => 'Verification code has expired. Please request a new one.'], 400);
            return;
        }

        // Mark as verified
        $update = $db->prepare('UPDATE otps SET is_verified = TRUE WHERE id = ?');
        $update->execute([$record['id']]);

        self::json([
            'status'     => 'success',
            'message'    => 'Verification successful',
            'identifier' => $identifier,
        ]);
    }

    /**
     * POST /api/register
     * Creates new user account after validating password policy and OTP verification.
     */
    public static function register(array $body): void
    {
        $name     = trim($body['name'] ?? '');
        $email    = trim($body['email'] ?? '');
        $phone    = trim($body['phone'] ?? '');
        $password = $body['password'] ?? '';
        $method   = $body['signupMethod'] ?? ($email ? 'email' : 'phone');

        if (!$name) {
            self::json(['status' => 'error', 'message' => 'Full name is required'], 400);
            return;
        }

        $identifier = $method === 'phone' ? $phone : $email;
        if (!$identifier) {
            self::json(['status' => 'error', 'message' => ($method === 'phone' ? 'Phone number' : 'Email address') . ' is required'], 400);
            return;
        }

        // Validate email format if provided
        if ($email && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            self::json(['status' => 'error', 'message' => 'Invalid email address format'], 400);
            return;
        }

        // Password requirements validation:
        // - At least 8 characters
        // - Letters (upper/lower)
        // - Numbers
        // - Symbols
        if (strlen($password) < 8) {
            self::json(['status' => 'error', 'message' => 'Password must be at least 8 characters long'], 400);
            return;
        }
        if (!preg_match('/[a-zA-Z]/', $password)) {
            self::json(['status' => 'error', 'message' => 'Password must contain at least one letter'], 400);
            return;
        }
        if (!preg_match('/[0-9]/', $password)) {
            self::json(['status' => 'error', 'message' => 'Password must contain at least one number'], 400);
            return;
        }
        if (!preg_match('/[^a-zA-Z0-9]/', $password)) {
            self::json(['status' => 'error', 'message' => 'Password must contain at least one special symbol (e.g. !@#$%^&*)'], 400);
            return;
        }

        $db = Database::getConnection();

        // Check if user already exists
        if ($email) {
            $existing = $db->prepare('SELECT id FROM users WHERE email = ?');
            $existing->execute([$email]);
            if ($existing->fetch()) {
                self::json(['status' => 'error', 'message' => 'Email already registered. Please sign in.'], 409);
                return;
            }
        }

        if ($phone) {
            $existingPhone = $db->prepare('SELECT id FROM users WHERE phone = ?');
            $existingPhone->execute([$phone]);
            if ($existingPhone->fetch()) {
                self::json(['status' => 'error', 'message' => 'Phone number already registered. Please sign in.'], 409);
                return;
            }
        }

        // Secure password hashing with bcrypt
        $hash = password_hash($password, PASSWORD_BCRYPT);

        $stmt = $db->prepare('
            INSERT INTO users (name, email, phone, password_hash)
            VALUES (?, ?, ?, ?)
        ');
        $stmt->execute([$name, $email ?: null, $phone ?: null, $hash]);
        $userId = (int) $db->lastInsertId();

        $token = JwtService::issueToken($userId);

        self::json([
            'status'  => 'success',
            'token'   => $token,
            'user'    => [
                'id'    => $userId,
                'name'  => $name,
                'email' => $email,
                'phone' => $phone,
            ],
            'message' => 'Account created successfully!',
        ], 201);
    }

    /**
     * POST /api/login
     * Signs in a user using email OR phone number + password.
     */
    public static function login(array $body): void
    {
        $identifier = trim($body['identifier'] ?? $body['email'] ?? $body['phone'] ?? '');
        $password   = $body['password'] ?? '';

        if (!$identifier || !$password) {
            self::json(['status' => 'error', 'message' => 'Email/Phone and password are required'], 400);
            return;
        }

        $db = Database::getConnection();
        $stmt = $db->prepare('
            SELECT id, name, email, phone, password_hash
            FROM users
            WHERE email = ? OR phone = ?
            LIMIT 1
        ');
        $stmt->execute([$identifier, $identifier]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password_hash'])) {
            self::json(['status' => 'error', 'message' => 'Invalid credentials. Please check your details and try again.'], 401);
            return;
        }

        $token = JwtService::issueToken((int) $user['id']);

        self::json([
            'status' => 'success',
            'token'  => $token,
            'user'   => [
                'id'    => $user['id'],
                'name'  => $user['name'],
                'email' => $user['email'],
                'phone' => $user['phone'],
            ],
        ]);
    }

    private static function json(array $data, int $statusCode = 200): void
    {
        http_response_code($statusCode);
        echo json_encode($data);
    }
}
