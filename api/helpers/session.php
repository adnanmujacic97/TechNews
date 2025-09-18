 <?php
// Starts session with security settings
session_start();

// Optional: improve security
if (session_status() === PHP_SESSION_ACTIVE) {
    ini_set('session.cookie_httponly', 1);   // JS can't read cookie
    ini_set('session.use_strict_mode', 1);   // Only accept valid session IDs
    ini_set('session.cookie_samesite', 'Lax'); // Prevent CSRF
}
?>