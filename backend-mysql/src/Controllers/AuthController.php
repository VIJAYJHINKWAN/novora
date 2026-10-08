<?php

namespace App\Controllers;

use App\Database\Database;
use App\Auth\JwtService;

class AuthController
{
    public static function register(array $body): void
    {
        $name = trim($body['name'] ?? '');
        $email = trim($body['email'] ?? '');
        $password = $body['password'] ?? '';

        if (!$name || !$email || !$password) {
            self::json(['status' => 'error', 'message' => 'name, email and password are required'], 400);
            return;
        }

        $db = Database::getConnection();

        $existing = $db->prepare('SELECT id FROM users WHERE email = ?');
        $existing->execute([$email]);
        if ($existing->fetch()) {
            self::json(['status' => 'error', 'message' => 'Email already registered'], 409);
            return;
        }

        $hash = password_hash($password, PASSWORD_BCRYPT);

        $stmt = $db->prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)');
        $stmt->execute([$name, $email, $hash]);
        $userId = (int) $db->lastInsertId();

        $token = JwtService::issueToken($userId);

        self::json([
            'status' => 'success',
            'token' => $token,
            'user' => ['id' => $userId, 'name' => $name, 'email' => $email],
        ], 201);
    }

    public static function login(array $body): void
    {
        $email = trim($body['email'] ?? '');
        $password = $body['password'] ?? '';

        if (!$email || !$password) {
            self::json(['status' => 'error', 'message' => 'email and password are required'], 400);
            return;
        }

        $db = Database::getConnection();
        $stmt = $db->prepare('SELECT id, name, email, password_hash FROM users WHERE email = ?');
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password_hash'])) {
            self::json(['status' => 'error', 'message' => 'Invalid email or password'], 401);
            return;
        }

        $token = JwtService::issueToken((int) $user['id']);

        self::json([
            'status' => 'success',
            'token' => $token,
            'user' => ['id' => $user['id'], 'name' => $user['name'], 'email' => $user['email']],
        ]);
    }

    private static function json(array $data, int $statusCode = 200): void
    {
        http_response_code($statusCode);
        echo json_encode($data);
    }
}
