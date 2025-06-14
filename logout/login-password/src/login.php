<?php
session_start();
require_once __DIR__ . '/helpers.php';

// Получение данных из формы входа
$login = $_POST['login'] ?? '';
$password = $_POST['password'] ?? '';

// Проверка данных базы данных
$connect = getDB();

// Используем подготовленные выражения для защиты от SQL-инъекций
$stmt = $connect->prepare("SELECT * FROM `users` WHERE `login` = ?");
$stmt->bind_param("s", $login);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    
    // Проверяем пароль (предполагая, что в БД хранится хэш пароля)
    if (password_verify($password, $user['password'])) {
        $_SESSION['user']['id'] = $user['id'];
        header("Location: index.html");
        exit; // Важно завершить выполнение скрипта после перенаправления
    } else {
        die('Вы ввели неверные данные!');
    }
} else {
    die('Вы ввели неверные данные!');
}