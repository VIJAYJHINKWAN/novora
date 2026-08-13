<?php

require __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
use App\Database\SupabaseService;

// Ensure proper JSON response headers
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight OPTIONS requests for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Load .env variables (surpress error if .env doesn't exist yet for initial setup)
try {
    $dotenv = Dotenv::createImmutable(__DIR__ . '/..');
    $dotenv->safeLoad();
} catch (\Exception $e) {
    // If no .env is found, we continue and let SupabaseService handle the missing env variables
}

// Basic Routing
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($requestUri === '/api/health') {
    try {
        // Attempt to initialize the Supabase client to check if env is set up
        $client = SupabaseService::getClient();
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Backend is running and configured!',
            'timestamp' => date('c')
        ]);
    } catch (\Exception $e) {
         http_response_code(500);
         echo json_encode([
            'status' => 'error',
            'message' => $e->getMessage()
        ]);
    }
} else {
    http_response_code(404);
    echo json_encode([
        'status' => 'error',
        'message' => 'Endpoint not found'
    ]);
}
