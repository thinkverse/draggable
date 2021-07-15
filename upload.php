<?php declare(strict_types=1);

// Log the incomming POST request to see what we get.
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    print "Nothing to see here...";
    die();
}

header('Location: /');

$fp = fopen(__DIR__ . '/logs/links.log', 'a+');
fwrite($fp, print_r($_POST, true));
fclose($fp);
