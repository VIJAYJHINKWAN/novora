<?php

namespace App\Controllers;

use App\Database\Database;

class ProfileController
{
    // GET /api/profile - the current logged-in user's own profile
    public static function get(int $userId): void
    {
        $db = Database::getConnection();
        $stmt = $db->prepare('
            SELECT id, name, email, phone, bio, location, reading_score AS readingScore,
                   genres, goals, verification_status AS verificationStatus,
                   streak, monthly_goal AS monthlyGoal, monthly_progress AS monthlyProgress
            FROM users WHERE id = ?
        ');
        $stmt->execute([$userId]);
        $profile = $stmt->fetch();

        if (!$profile) {
            self::json(['status' => 'error', 'message' => 'User not found'], 404);
            return;
        }

        $profile['verificationStatus'] = (bool) $profile['verificationStatus'];

        $badgeStmt = $db->prepare('SELECT badge FROM user_badges WHERE user_id = ?');
        $badgeStmt->execute([$userId]);
        $profile['badges'] = array_column($badgeStmt->fetchAll(), 'badge');

        self::json(['status' => 'success', 'data' => $profile]);
    }

    // PUT /api/profile - update editable fields on the current user's profile
    public static function update(int $userId, array $body): void
    {
        $fields = [
            'name' => 'name', 'phone' => 'phone', 'bio' => 'bio', 'location' => 'location',
            'genres' => 'genres', 'goals' => 'goals', 'monthlyGoal' => 'monthly_goal',
        ];

        $sets = [];
        $values = [];
        foreach ($fields as $inputKey => $column) {
            if (array_key_exists($inputKey, $body)) {
                $sets[] = "{$column} = ?";
                $values[] = $body[$inputKey];
            }
        }

        if (empty($sets)) {
            self::json(['status' => 'error', 'message' => 'No valid fields to update'], 400);
            return;
        }

        $values[] = $userId;
        $db = Database::getConnection();
        $stmt = $db->prepare('UPDATE users SET ' . implode(', ', $sets) . ' WHERE id = ?');
        $stmt->execute($values);

        self::json(['status' => 'success']);
    }

    private static function json(array $data, int $statusCode = 200): void
    {
        http_response_code($statusCode);
        echo json_encode($data);
    }
}
