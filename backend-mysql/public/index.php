<?php

require __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
use App\Controllers\AuthController;
use App\Controllers\BookController;
use App\Controllers\EventController;
use App\Controllers\MessageController;
use App\Controllers\StoryController;
use App\Controllers\ProfileController;
use App\Controllers\ReaderController;
use App\Middleware\AuthMiddleware;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->safeLoad();

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Parse JSON body once, for any POST/PUT request
$body = [];
if (in_array($method, ['POST', 'PUT'], true)) {
    $raw = file_get_contents('php://input');
    $body = json_decode($raw, true) ?? [];
}

try {
    // ---------- Public routes ----------
    if ($uri === '/api/health' && $method === 'GET') {
        echo json_encode(['status' => 'success', 'message' => 'Backend is running', 'timestamp' => date('c')]);
        exit();
    }

    if ($uri === '/api/auth/send-otp' && $method === 'POST') {
        AuthController::sendOtp($body);
        exit();
    }

    if ($uri === '/api/auth/verify-otp' && $method === 'POST') {
        AuthController::verifyOtp($body);
        exit();
    }

    if ($uri === '/api/register' && $method === 'POST') {
        AuthController::register($body);
        exit();
    }

    if ($uri === '/api/login' && $method === 'POST') {
        AuthController::login($body);
        exit();
    }

    // ---------- Protected routes (require a valid JWT) ----------
    if ($uri === '/api/books' && $method === 'GET') {
        $userId = AuthMiddleware::requireAuth();
        BookController::list($userId);
        exit();
    }

    if ($uri === '/api/books' && $method === 'POST') {
        $userId = AuthMiddleware::requireAuth();
        BookController::create($userId, $body);
        exit();
    }

    // matches /api/books/{id}/like
        if ($uri === '/api/messages' && $method === 'GET') {
        $userId = AuthMiddleware::requireAuth();
        MessageController::recentConversations($userId);
        exit();
    }
    if (preg_match('#^/api/books/(\d+)/like$#', $uri, $m) && $method === 'POST') {
        $userId = AuthMiddleware::requireAuth();
        BookController::toggleLike($userId, (int) $m[1]);
        exit();
    }

    // ---------- Events ----------
    if ($uri === '/api/events' && $method === 'GET') {
        $userId = AuthMiddleware::requireAuth();
        EventController::list($userId);
        exit();
    }

    if ($uri === '/api/events' && $method === 'POST') {
        $userId = AuthMiddleware::requireAuth();
        EventController::create($userId, $body);
        exit();
    }

    if (preg_match('#^/api/events/(\d+)/rsvp$#', $uri, $m) && $method === 'POST') {
        $userId = AuthMiddleware::requireAuth();
        EventController::toggleRsvp($userId, (int) $m[1]);
        exit();
    }

    // ---------- Messages ----------
    if (preg_match('#^/api/messages/(\d+)$#', $uri, $m) && $method === 'GET') {
        $userId = AuthMiddleware::requireAuth();
        MessageController::list($userId, (int) $m[1]);
        exit();
    }

    if ($uri === '/api/messages' && $method === 'POST') {
        $userId = AuthMiddleware::requireAuth();
        MessageController::send($userId, $body);
        exit();
    }

    // ---------- Reading Stories ----------
    if ($uri === '/api/stories' && $method === 'GET') {
        $userId = AuthMiddleware::requireAuth();
        StoryController::list($userId);
        exit();
    }

    if ($uri === '/api/stories' && $method === 'POST') {
        $userId = AuthMiddleware::requireAuth();
        StoryController::create($userId, $body);
        exit();
    }

    if (preg_match('#^/api/stories/(\d+)/like$#', $uri, $m) && $method === 'POST') {
        $userId = AuthMiddleware::requireAuth();
        StoryController::toggleLike($userId, (int) $m[1]);
        exit();
    }

    // ---------- Profile ----------
    if ($uri === '/api/profile' && $method === 'GET') {
        $userId = AuthMiddleware::requireAuth();
        ProfileController::get($userId);
        exit();
    }

    if ($uri === '/api/profile' && $method === 'PUT') {
        $userId = AuthMiddleware::requireAuth();
        ProfileController::update($userId, $body);
        exit();
    }

    // ---------- Readers ----------
    if ($uri === '/api/readers' && $method === 'GET') {
        $userId = AuthMiddleware::requireAuth();
        ReaderController::list($userId);
        exit();
    }

    // ---------- No match ----------
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Endpoint not found']);

} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}