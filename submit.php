<?php
// submit.php - receives JSON POST, validates, and returns JSON response
header('Content-Type: application/json; charset=utf-8');

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON']);
    exit;
}

$errors = [];

$name = isset($data['name']) ? trim($data['name']) : '';
$email = isset($data['email']) ? trim($data['email']) : '';
$message = isset($data['message']) ? trim($data['message']) : '';

if ($name === '' || mb_strlen($name) < 2) {
    $errors['name'] = 'Name is required (min 2 chars)';
}

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Valid email is required';
}

if ($message === '' || mb_strlen($message) < 10) {
    $errors['message'] = 'Message must be at least 10 characters';
}

if (!empty($errors)) {
    echo json_encode(['success' => false, 'errors' => $errors, 'message' => 'Validation failed']);
    exit;
}

// For demo: pretend to store or send the message. We'll return success and include the user's name.
// In a real app you'd persist to DB or send email here.

$displayName = $name !== '' ? $name : '';
$defaultMsg = $displayName !== '' ? "Thanks $displayName, your message was received" : 'Thanks, your message was received';
echo json_encode(['success' => true, 'message' => $defaultMsg]);
