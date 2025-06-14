<?php

session_start();

require_once __DIR__ . '/../helpers.php';

$name = $_POST['name'];
$login = $_POST['login'];
$email = $_POST['email'];
$password = $_POST['password'];
$password_confirmation = $_POST['password_confirmation'];

$_SESSION['validation'] = [];

if (empty($name)) {
    $_SESSION['validation']['name'] = 'Неверное имя';
}


if (!mpty($_SESSION['validation'])) {
    redirect(path '/register.php');
}





















