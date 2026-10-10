<?php

namespace App\Controllers;

use App\Database\Database;

class BookController
{
    // GET /api/books - list all books, with isLiked/isOwned relative to the current user
    public static function list(int $userId): void
    {
        $db = Database::getConnection();
        $stmt = $db->prepare('
            SELECT
                b.id, b.title, b.author, b.genre, b.summary, b.rating,
                b.is_read AS isRead, b.is_wishlist AS isWishlist,
                b.is_exchangeable AS isExchangeable, b.is_lendable AS isLendable,
                b.cover_url AS coverUrl, b.likes_count AS likesCount,
                u.name AS ownerName, u.location AS ownerDistance, u.reading_score AS ownerRating,
                (b.owner_id = ?) AS isOwned,
                EXISTS(SELECT 1 FROM book_likes bl WHERE bl.book_id = b.id AND bl.user_id = ?) AS isLiked
            FROM books b
            JOIN users u ON u.id = b.owner_id
            ORDER BY b.created_at DESC
        ');
        $stmt->execute([$userId, $userId]);
        $books = $stmt->fetchAll();

        // MySQL returns 0/1 for booleans - cast them properly for the frontend
        foreach ($books as &$book) {
            foreach (['isRead', 'isWishlist', 'isExchangeable', 'isLendable', 'isOwned', 'isLiked'] as $field) {
                $book[$field] = (bool) $book[$field];
            }
        }

        self::json(['status' => 'success', 'data' => $books]);
    }

    // POST /api/books - add a new book owned by the current user
    public static function create(int $userId, array $body): void
    {
        $title = trim($body['title'] ?? '');
        $author = trim($body['author'] ?? '');

        if (!$title || !$author) {
            self::json(['status' => 'error', 'message' => 'title and author are required'], 400);
            return;
        }

        $db = Database::getConnection();
        $stmt = $db->prepare('
            INSERT INTO books (owner_id, title, author, genre, summary, is_exchangeable, is_lendable, cover_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ');
        $stmt->execute([
            $userId,
            $title,
            $author,
            $body['genre'] ?? null,
            $body['summary'] ?? null,
            !empty($body['isExchangeable']) ? 1 : 0,
            !empty($body['isLendable']) ? 1 : 0,
            $body['coverUrl'] ?? ($body['cover_url'] ?? null),
        ]);

        self::json(['status' => 'success', 'id' => (int) $db->lastInsertId()], 201);
    }

    // POST /api/books/{id}/like - toggle like for the current user
    public static function toggleLike(int $userId, int $bookId): void
    {
        $db = Database::getConnection();

        $check = $db->prepare('SELECT 1 FROM book_likes WHERE user_id = ? AND book_id = ?');
        $check->execute([$userId, $bookId]);

        if ($check->fetch()) {
            $db->prepare('DELETE FROM book_likes WHERE user_id = ? AND book_id = ?')->execute([$userId, $bookId]);
            $db->prepare('UPDATE books SET likes_count = likes_count - 1 WHERE id = ?')->execute([$bookId]);
            $liked = false;
        } else {
            $db->prepare('INSERT INTO book_likes (user_id, book_id) VALUES (?, ?)')->execute([$userId, $bookId]);
            $db->prepare('UPDATE books SET likes_count = likes_count + 1 WHERE id = ?')->execute([$bookId]);
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
