<?php

namespace App\Controllers;

use App\Database\Database;

class EventController
{
    // GET /api/events
    public static function list(int $userId): void
    {
        $db = Database::getConnection();
        $stmt = $db->prepare('
            SELECT
                e.id, e.title, e.category, e.event_date AS date, e.event_time AS time,
                e.location, e.organizer_name AS organizerName, e.description,
                EXISTS(SELECT 1 FROM event_rsvps r WHERE r.event_id = e.id AND r.user_id = ?) AS isRsvped,
                (SELECT COUNT(*) FROM event_rsvps r2 WHERE r2.event_id = e.id) AS attendeeCount
            FROM events e
            ORDER BY e.created_at DESC
        ');
        $stmt->execute([$userId]);
        $events = $stmt->fetchAll();

        foreach ($events as &$event) {
            $event['isRsvped'] = (bool) $event['isRsvped'];
            $event['attendeeCount'] = (int) $event['attendeeCount'];
        }

        self::json(['status' => 'success', 'data' => $events]);
    }

    // POST /api/events
    public static function create(int $userId, array $body): void
    {
        $title = trim($body['title'] ?? '');
        $category = trim($body['category'] ?? '');
        $date = trim($body['date'] ?? '');
        $time = trim($body['time'] ?? '');
        $location = trim($body['location'] ?? '');
        $organizerName = trim($body['organizerName'] ?? '');

        if (!$title || !$category || !$date || !$time || !$location || !$organizerName) {
            self::json(['status' => 'error', 'message' => 'title, category, date, time, location and organizerName are required'], 400);
            return;
        }

        $db = Database::getConnection();
        $stmt = $db->prepare('
            INSERT INTO events (organizer_id, title, category, event_date, event_time, location, organizer_name, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ');
        $stmt->execute([
            $userId, $title, $category, $date, $time, $location, $organizerName,
            $body['description'] ?? null,
        ]);

        self::json(['status' => 'success', 'id' => (int) $db->lastInsertId()], 201);
    }

    // POST /api/events/{id}/rsvp - toggle RSVP for the current user
    public static function toggleRsvp(int $userId, int $eventId): void
    {
        $db = Database::getConnection();

        $check = $db->prepare('SELECT 1 FROM event_rsvps WHERE user_id = ? AND event_id = ?');
        $check->execute([$userId, $eventId]);

        if ($check->fetch()) {
            $db->prepare('DELETE FROM event_rsvps WHERE user_id = ? AND event_id = ?')->execute([$userId, $eventId]);
            $rsvped = false;
        } else {
            $db->prepare('INSERT INTO event_rsvps (user_id, event_id) VALUES (?, ?)')->execute([$userId, $eventId]);
            $rsvped = true;
        }

        self::json(['status' => 'success', 'isRsvped' => $rsvped]);
    }

    private static function json(array $data, int $statusCode = 200): void
    {
        http_response_code($statusCode);
        echo json_encode($data);
    }
}
