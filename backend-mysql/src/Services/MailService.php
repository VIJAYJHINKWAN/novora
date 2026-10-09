<?php

namespace App\Services;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class MailService
{
    /**
     * Sends an OTP verification email to the user.
     * Supports SMTP (e.g. Gmail App Password, Brevo, SendGrid) and PHP native mail().
     *
     * @param string $toEmail
     * @param string $otpCode
     * @return array ['success' => bool, 'message' => string, 'error' => ?string]
     */
    public static function sendOtpEmail(string $toEmail, string $otpCode): array
    {
        $smtpHost = $_ENV['SMTP_HOST'] ?? '';
        $smtpUser = $_ENV['SMTP_USER'] ?? '';
        $smtpPass = $_ENV['SMTP_PASS'] ?? '';
        $smtpPort = (int)($_ENV['SMTP_PORT'] ?? 587);
        $fromEmail = $_ENV['SMTP_FROM'] ?? ($smtpUser ?: 'noreply@novora.local');
        $fromName = $_ENV['SMTP_FROM_NAME'] ?? 'Novora (Litverse)';

        // 1. Try PHPMailer via SMTP if host, user, and pass are configured
        if (!empty($smtpHost) && !empty($smtpUser) && !empty($smtpPass)) {
            $mail = new PHPMailer(true);
            try {
                $mail->isSMTP();
                $mail->Host       = $smtpHost;
                $mail->SMTPAuth   = true;
                $mail->Username   = $smtpUser;
                $mail->Password   = $smtpPass;
                $mail->SMTPSecure = $smtpPort === 465 ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port       = $smtpPort;

                $mail->setFrom($fromEmail, $fromName);
                $mail->addAddress($toEmail);

                $mail->isHTML(true);
                $mail->Subject = "Your Novora Verification Code: {$otpCode}";
                $mail->Body    = "
                    <div style='font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e0d7c7; border-radius: 12px; background: #fffcf8;'>
                        <h2 style='color: #4a3427; margin-bottom: 8px;'>Welcome to Novora</h2>
                        <p style='color: #665b53; font-size: 15px;'>Thank you for joining our literary community. Use the verification code below to complete your registration:</p>
                        <div style='background: #f4ede3; padding: 18px; border-radius: 8px; text-align: center; margin: 24px 0;'>
                            <span style='font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #8c532b;'>{$otpCode}</span>
                        </div>
                        <p style='color: #8c827a; font-size: 13px;'>This code is valid for 5 minutes. If you did not request this, please ignore this email.</p>
                    </div>
                ";
                $mail->AltBody = "Your Novora verification code is: {$otpCode}. It expires in 5 minutes.";

                $mail->send();
                return ['success' => true, 'message' => 'Verification code sent to ' . $toEmail];
            } catch (Exception $e) {
                error_log("PHPMailer error: " . $mail->ErrorInfo);
                return [
                    'success' => false,
                    'error'   => 'Failed to send email: ' . $mail->ErrorInfo
                ];
            }
        }

        // 2. Fallback to PHP native mail() if available
        if (function_exists('mail')) {
            $subject = "Your Novora Verification Code: {$otpCode}";
            $message = "Your Novora verification code is: {$otpCode}\n\nThis code expires in 5 minutes.";
            $headers = "From: {$fromEmail}\r\nReply-To: {$fromEmail}\r\n";
            $sent = @mail($toEmail, $subject, $message, $headers);
            if ($sent) {
                return ['success' => true, 'message' => 'Verification code sent to ' . $toEmail];
            }
        }

        // 3. Fallback: If running on local Android emulator and SMTP not yet set in .env,
        // dispatch verification message directly to the emulator via ADB bridge!
        $emulatorDelivered = self::sendToAndroidEmulator($toEmail, $otpCode);
        if ($emulatorDelivered) {
            return [
                'success' => true,
                'message' => "Verification code sent to {$toEmail} (delivered to Android emulator notification)",
            ];
        }

        return [
            'success' => false,
            'error'   => 'SMTP credentials not configured in backend-mysql/.env. Please configure SMTP_HOST, SMTP_USER, and SMTP_PASS (e.g. free Gmail App Password).'
        ];
    }

    private static function sendToAndroidEmulator(string $email, string $otpCode): bool
    {
        $localAppData = getenv('LOCALAPPDATA');
        $adbPath = $localAppData ? "{$localAppData}\\Android\\Sdk\\platform-tools\\adb.exe" : 'adb';

        $sender = escapeshellarg("Novora_Auth");
        $text   = escapeshellarg("Novora verification code for {$email} is: {$otpCode}. Valid for 5 minutes.");

        $cmd = "\"{$adbPath}\" emu sms send {$sender} {$text} 2>&1";
        $output = @shell_exec($cmd);

        return $output !== null && str_contains($output, 'OK');
    }
}
