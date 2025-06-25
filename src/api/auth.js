const API_URL = process.env.REACT_APP_USERS_API_URL || "https://json-server-cosmic-explorer.glitch.me/api/users";

/**
 * Перевірка унікальності email
 */
export async function checkEmailUnique(email) {
    const res = await fetch(`${API_URL}?email=${encodeURIComponent(email)}`);
    const users = await res.json();
    return users.length === 0;
}

/**
 * Реєстрація користувача
 */
export async function registerUser(email, password) {
    // Перевіряємо унікальність email перед реєстрацією
    const isUnique = await checkEmailUnique(email);
    if (!isUnique) throw new Error("Email вже зайнятий!");

    const res = await fetch(API_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Registration failed");
    return res.json();
}

/**
 * Вхід користувача
 */
export async function loginUser(email, password) {
    // Шукаємо лише по email
    const res = await fetch(`${API_URL}?email=${encodeURIComponent(email)}`);
    const users = await res.json();
    if (users.length === 0 || users[0].password !== password) {
        throw new Error("Невірний email або пароль");
    }
    return users[0];
}