<?php

namespace App\Services;

class SmsService
{
    /**
     * Sends an OTP verification SMS to the user's phone number.
     * Supports Twilio, Fast2SMS, and direct Android Emulator SMS bridge via ADB.
     *
     * @param string $phone
     * @param string $otpCode
     * @return array ['success' => bool, 'message' => string, 'error' => ?string]
     */
    public static function sendOtpSms(string $phone, string $otpCode): array
    {
        $messageText = "Your Novora verification code is: {$otpCode}. It expires in 5 minutes.";
        $sentViaGateway = false;

        // 1. Check Twilio in .env
        $twilioSid   = $_ENV['TWILIO_SID'] ?? '';
        $twilioToken = $_ENV['TWILIO_TOKEN'] ?? '';
        $twilioFrom  = $_ENV['TWILIO_PHONE_NUMBER'] ?? '';

        if (!empty($twilioSid) && !empty($twilioToken) && !empty($twilioFrom)) {
            $url = "https://api.twilio.com/2010-04-01/Accounts/{$twilioSid}/Messages.json";
            $data = [
                'From' => $twilioFrom,
                'To'   => $phone,
                'Body' => $messageText,
            ];
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
            curl_setopt($ch, CURLOPT_USERPWD, "{$twilioSid}:{$twilioToken}");
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 10);
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($httpCode >= 200 && $httpCode < 300) {
                return ['success' => true, 'message' => 'SMS sent successfully via Twilio'];
            }
        }

        // 2. Check Fast2SMS in .env
        $fast2smsKey = $_ENV['FAST2SMS_API_KEY'] ?? '';
        if (!empty($fast2smsKey)) {
            $cleanPhone = preg_replace('/\D/', '', $phone);
            if (strlen($cleanPhone) === 12 && str_starts_with($cleanPhone, '91')) {
                $cleanPhone = substr($cleanPhone, 2);
            }

            $url = 'https://www.fast2sms.com/dev/bulkV2';
            $fields = [
                'variables_values' => $otpCode,
                'route'            => 'otp',
                'numbers'          => $cleanPhone,
            ];
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                "authorization: {$fast2smsKey}",
                "Content-Type: application/json",
            ]);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 10);
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($httpCode >= 200 && $httpCode < 300) {
                return ['success' => true, 'message' => 'SMS sent successfully via Fast2SMS'];
            }
        }

        // 3. Android Emulator Native SMS Bridge:
        // Automatically injects a real system SMS notification into the Android emulator via ADB!
        $emulatorDelivered = self::sendToAndroidEmulator($phone, $messageText);
        if ($emulatorDelivered) {
            return [
                'success' => true,
                'message' => 'SMS notification delivered directly to Android Emulator',
            ];
        }

        return [
            'success' => false,
            'error'   => 'SMS provider not configured (TWILIO_* or FAST2SMS_API_KEY in backend-mysql/.env) and Android emulator ADB is not reachable.',
        ];
    }

    private static function sendToAndroidEmulator(string $sender, string $text): bool
    {
        $localAppData = getenv('LOCALAPPDATA');
        $adbPath = $localAppData ? "{$localAppData}\\Android\\Sdk\\platform-tools\\adb.exe" : 'adb';

        $safeSender = escapeshellarg($sender);
        $safeText   = escapeshellarg($text);

        $cmd = "\"{$adbPath}\" emu sms send {$safeSender} {$safeText} 2>&1";
        $output = @shell_exec($cmd);

        return $output !== null && str_contains($output, 'OK');
    }
}
