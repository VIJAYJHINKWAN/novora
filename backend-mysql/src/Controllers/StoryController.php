<?php

namespace App\Controllers;

use App\Database\Database;

class StoryController
{
    // GET /api/stories
    public static function list(int $userId): void
    {
        $db = Database::getConnection();
        $stmt = $db->prepare('
            SELECT
                s.id, s.book_title AS bookTitle, s.note_text AS noteText,
                s.story_type AS storyType, s.background_theme AS backgroundTheme,
                s.likes_count AS likesCount, u.name AS authorName,
                EXISTS(SELECT 1 FROM story_likes sl WHERE sl.story_id = s.id AND sl.user_id = ?) AS isLiked
            FROM reading_stories s
            JOIN users u ON u.id = s.author_id
            ORDER BY s.created_at DESC
        ');
        $stmt->execute([$userId]);
        $stories = $stmt->fetchAll();

        foreach ($stories as &$story) {
            $story['isLiked'] = (bool) $story['isLiked'];
        }

        self::json(['status' => 'success', 'data' => $stories]);
    }

    // POST /api/stories
    public static function create(int $userId, array $body): void
    {
        $bookTitle = trim($body['bookTitle'] ?? '');
        $noteText = trim($body['noteText'] ?? '');
        $storyType = trim($body['storyType'] ?? '');
        $backgroundTheme = trim($body['backgroundTheme'] ?? '');

        if (!$bookTitle || !$noteText || !$storyType || !$backgroundTheme) {
            self::json(['status' => 'error', 'message' => 'bookTitle, noteText, storyType and backgroundTheme are required'], 400);
            return;
        }

        $db = Database::getConnection();
        $stmt = $db->prepare('
            INSERT INTO reading_stories (author_id, book_title, note_text, story_type, background_theme)
            VALUES (?, ?, ?, ?, ?)
        ');
        $stmt->execute([$userId, $bookTitle, $noteText, $storyType, $backgroundTheme]);

        self::json(['status' => 'success', 'id' => (int) $db->lastInsertId()], 201);
    }

    // POST /api/stories/{id}/like
    public static function toggleLike(int $userId, int $storyId): void
    {
        $db = Database::getConnection();

        $check = $db->prepare('SELECT 1 FROM story_likes WHERE user_id = ? AND story_id = ?');
        $check->execute([$userId, $storyId]);

        if ($check->fetch()) {
            $db->prepare('DELETE FROM story_likes WHERE user_id = ? AND story_id = ?')->execute([$userId, $storyId]);
            $db->prepare('UPDATE reading_stories SET likes_count = likes_count - 1 WHERE id = ?')->execute([$storyId]);
            $liked = false;
        } else {
            $db->prepare('INSERT INTO story_likes (user_id, story_id) VALUES (?, ?)')->execute([$userId, $storyId]);
            $db->prepare('UPDATE reading_stories SET likes_count = likes_count + 1 WHERE id = ?')->execute([$storyId]);
            $liked = true;
        }

        self::json(['status' => 'success', 'isLiked' => $liked]);
    }

    private static function json(array $data, int $statusCode = 200): void
    {
        http_response_code($statusCode);
        echo json_encode($data);
    }
}
