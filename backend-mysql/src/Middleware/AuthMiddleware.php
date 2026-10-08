<?php

namespace App\Middleware;

use App\Auth\JwtService;

class AuthMiddleware
{
    // Returns the authenticated user's id, or halts the request with 401
    public static function requireAuth(): int
    {
        $token = JwtService::getTokenFromRequest();

        if (!$token) {
            self::reject('Missing Authorization token');
        }

        $userId = JwtService::verifyToken($token);

        if ($userId === null) {
            self::reject('Invalid or expired token');
        }

        return $userId;
    }

    private static function reject(string $message): void
    {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => $message]);
        exit();
    }
}
