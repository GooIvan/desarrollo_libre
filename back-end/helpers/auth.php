<?php

// Simple session-based auth helper. Start session before using.
function require_session(){
    if (session_status() === PHP_SESSION_NONE) session_start();
}

function login_user($IdAccount, $RoleId){
    require_session();
    $_SESSION['IdAccount'] = $IdAccount;
    $_SESSION['RoleId'] = $RoleId;
}

function logout_user(){
    require_session();
    session_unset();
    session_destroy();
}

function current_user(){
    require_session();
    return isset($_SESSION['IdAccount']) ? [ 'IdAccount' => $_SESSION['IdAccount'], 'RoleId' => $_SESSION['RoleId'] ] : null;
}

function require_role($roles){
    require_session();
    $user = current_user();
    if (!$user) return false;
    if (is_array($roles)) return in_array($user['RoleId'], $roles);
    return $user['RoleId'] == $roles;
}
