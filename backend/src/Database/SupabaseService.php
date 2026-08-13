<?php

namespace App\Database;

use Supabase\SupabaseClient;

class SupabaseService
{
    private static ?SupabaseClient $client = null;

    public static function getClient(): SupabaseClient
    {
        if (self::$client === null) {
            $url = $_ENV['SUPABASE_URL'] ?? '';
            $key = $_ENV['SUPABASE_KEY'] ?? '';

            if (empty($url) || empty($key)) {
                throw new \Exception("Supabase URL or Key is not set in the environment variables.");
            }

            self::$client = new SupabaseClient($url, $key);
        }

        return self::$client;
    }
}
