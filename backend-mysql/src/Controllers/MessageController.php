<?php

namespace App\Controllers;

use App\Database\Database;

class MessageController
{
    // GET /api/messages - list the most recent conversations for the current user
    public static function recentConversations(int $userId): void
    {
        $db = Database::getConnection();
        $stmt = $db->prepare('
            SELECT m.*,
                   CASE WHEN m.sender_id = ? THEN m.recipient_id ELSE m.sender_id END AS otherUserId
            FROM chat_messages m
            WHERE m.sender_id = ? OR m.recipient_id = ?
            ORDER BY m.created_at DESC
        ');
        $stmt->execute([$userId, $userId, $userId]);
        $rows = $stmt->fetchAll();

        $seen = [];
        $conversations = [];
        foreach ($rows as $row) {
            $otherId = (int) $row['otherUserId'];
            if (isset($seen[$otherId])) {
                continue;
            }
            $seen[$otherId] = true;
            $conversations[] = $row;
        }

        if (!empty($conversations)) {
            $ids = array_column($conversations, 'otherUserId');
            $placeholders = implode(',', array_fill(0, count($ids), '?'));
            $nameStmt = $db->prepare("SELECT id, name FROM users WHERE id IN ($placeholders)");
            $nameStmt->execute($ids);
            $names = [];
            foreach ($nameStmt->fetchAll() as $u) {
                $names[$u['id']] = $u['name'];
            }
            foreach ($conversations as &$c) {
                $c['otherUserName'] = $names[$c['otherUserId']] ?? 'Unknown';
                $c['text'] = $c['message_text'];
                $c['isExchangeCard'] = (bool) $c['is_exchange_card'];
                $c['exchangeBookTitle'] = $c['exchange_book_title'];
                $c['exchangeStatus'] = $c['exchange_status'];
                $c['createdAt'] = $c['created_at'];
                $c['senderId'] = $c['sender_id'];
                unset($c['message_text'], $c['is_exchange_card'], $c['exchange_book_title'], $c['exchange_status'], $c['created_at'], $c['sender_id'], $c['recipient_id']);
            }
        }

        self::json(['status' => 'success', 'data' => $conversations]);
    }

    // GET /api/messages/{otherUserId} - full conversation between current user and otherUserId
    public static function list(int $userId, int $otherUserId): void
    {
        $db = Database::getConnection();
        $stmt = $db->prepare('
            SELECT
                id, sender_id AS senderId, recipient_id AS recipientId,
                message_text AS text, is_exchange_card AS isExchangeCard,
                exchange_book_title AS exchangeBookTitle, exchange_status AS exchangeStatus,
                created_at AS createdAt
            FROM chat_messages
            WHERE (sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?)
            ORDER BY created_at ASC
        ');
        $stmt->execute([$userId, $otherUserId, $otherUserId, $userId]);
        $messages = $stmt->fetchAll();

        foreach ($messages as &$m) {
            $m['isExchangeCard'] = (bool) $m['isExchangeCard'];
        }

        self::json(['status' => 'success', 'data' => $messages]);
    }

    // POST /api/messages - send a message
    public static function send(int $userId, array $body): void
    {
        $recipientId = (int) ($body['recipientId'] ?? 0);
        $text = trim($body['text'] ?? '');

        if (!$recipientId || !$text) {
            self::json(['status' => 'error', 'message' => 'recipientId and text are required'], 400);
            return;
        }

        $db = Database::getConnection();
        $stmt = $db->prepare('
            INSERT INTO chat_messages (sender_id, recipient_id, message_text, is_exchange_card, exchange_book_title, exchange_status)
            VALUES (?, ?, ?, ?, ?, ?)
        ');
        $stmt->execute([
            $userId,
            $recipientId,
            $text,
            !empty($body['isExchangeCard']) ? 1 : 0,
            $body['exchangeBookTitle'] ?? null,
            $body['exchangeStatus'] ?? null,
        ]);

        self::json(['status' => 'success', 'id' => (int) $db->lastInsertId()], 201);
    }

    private static function json(array $data, int $statusCode = 200): void
    {
        http_response_code($statusCode);
        echo json_encode($data);
    }
}