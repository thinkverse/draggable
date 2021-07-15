<?php declare(strict_types=1);

header('Location: /');

function result(array $options, int $status = 200): void
{
    http_response_code($options['status'] ?? $status);

    print json_encode($options);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    result([
        'status' => 405,
        'message' => 'Method Not Allowed',
    ]);

    exit(0);
}

if (! key_exists('link', $_POST)) {
    result([
        'status' => 422,
        'message' => 'Unprocessable Entity',
    ]);

    exit(0);
}

$original_url = $_POST['link'];
$shortened_url = base64_encode(random_bytes(8));

$fp = fopen(__DIR__ . '/logs/links.log', 'a+');
fwrite($fp, $original_url . PHP_EOL);
fclose($fp);

result([
    'status' => 201,
    'message' => 'New Shortened Link Created',
    'data' => [
        'original_url' => $original_url,
        'shortened_url' => $shortened_url,
    ],
]);
