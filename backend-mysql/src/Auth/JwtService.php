<?php

namespace App\Auth;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtService
{
    public static function issueToken(int $userId): string
    {
        $secret = $_ENV['JWT_SECRET'];
        $expiry = (int) ($_ENV['JWT_EXPIRY_SECONDS'] ?? 604800);
        $now = time();

        $payload = [
            'sub' => $userId,
            'iat' => $now,
            'exp' => $now + $expiry,
        ];

        return JWT::encode($payload, $secret, 'HS256');
    }

    // Returns the user id from a valid token, or null if invalid/expired
    public static function verifyToken(string $token): ?int
    {
        try {
            $secret = $_ENV['JWT_SECRET'];
            $decoded = JWT::decode($token, new Key($secret, 'HS256'));
            return (int) $decoded->sub;
        } catch (\Exception $e) {
            return null;
        }
    }

    // Pulls "Authorization: Bearer <token>" out of the request headers
    public static function getTokenFromRequest(): ?string
    {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

        if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            return $matches[1];
        }

        return null;
    }
}
