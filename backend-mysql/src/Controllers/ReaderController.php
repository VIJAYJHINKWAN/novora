<?php

namespace App\Controllers;

use App\Database\Database;

class ReaderController
{
    public static function list(int $userId): void
    {
        $db = Database::getConnection();
        $stmt = $db->prepare('
            SELECT id, name, bio, location, reading_score AS readingScore,
                   genres, goals, verification_status AS verificationBadge
            FROM users
            WHERE id != ?
            ORDER BY name ASC
        ');
        $stmt->execute([$userId]);
        $readers = $stmt->fetchAll();

        foreach ($readers as &$r) {
            $r['verificationBadge'] = (bool) $r['verificationBadge'];
        }

        self::json(['status' => 'success', 'data' => $readers]);
    }

    private static function json(array $data, int $statusCode = 200): void
    {
        http_response_code($statusCode);
        echo json_encode($data);
    }
}