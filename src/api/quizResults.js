const API_URL = "https://json-server-cosmic-explorer.glitch.me/api/quizResults";

// Зберегти новий результат вікторини
export async function saveQuizResult({ userEmail, score, total, quizId }) {
    if (!userEmail) throw new Error("Авторизація обов'язкова.");
    if (!quizId) throw new Error("Ідентифікатор вікторини обов'язковий.");
    if (typeof score !== "number" || typeof total !== "number")
        throw new Error("Некоректний формат результату.");

    const payload = {
        userEmail,
        score,
        total,
        quizId,
        date: new Date().toISOString()
    };

    let res;
    try {
        res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
    } catch {
        throw new Error("Помилка мережі. Спробуйте ще раз.");
    }
    if (res.status === 201) {
        return await res.json();
    }
    throw new Error("Не вдалося зберегти результат.");
}

// Отримати всі результати користувача
export async function getQuizResults(userEmail) {
    if (!userEmail) throw new Error("Авторизація обов'язкова.");
    const url = `${API_URL}?userEmail=${encodeURIComponent(userEmail)}`;
    let res;
    try {
        res = await fetch(url, { method: "GET" });
    } catch {
        throw new Error("Помилка мережі.");
    }
    if (!res.ok) throw new Error("Не вдалося отримати результати.");
    return await res.json();
}

// Отримати результати по вікторині
export async function getQuizResultsByQuiz(userEmail, quizId) {
    if (!userEmail || !quizId) return [];
    const url = `${API_URL}?userEmail=${encodeURIComponent(
        userEmail
    )}&quizId=${encodeURIComponent(quizId)}`;
    let res;
    try {
        res = await fetch(url, { method: "GET" });
    } catch {
        return [];
    }
    if (!res.ok) return [];
    return await res.json();
}

// Скинути всі результати користувача
export async function resetAllQuizResults(userEmail) {
    if (!userEmail) throw new Error("Авторизація обов'язкова.");
    const all = await getQuizResults(userEmail);
    let deleted = 0;
    for (const resItem of all) {
        try {
            const res = await fetch(`${API_URL}/${resItem.id}`, { method: "DELETE" });
            if (res.status === 200 || res.status === 204) deleted++;
        } catch {}
    }
    return deleted;
}

// Скинути результати певної вікторини
export async function resetQuizResultsByQuiz(userEmail, quizId) {
    if (!userEmail) throw new Error("Авторизація обов'язкова.");
    if (!quizId) throw new Error("Ідентифікатор вікторини обов'язковий.");
    const all = await getQuizResultsByQuiz(userEmail, quizId);
    let deleted = 0;
    for (const resItem of all) {
        try {
            const res = await fetch(`${API_URL}/${resItem.id}`, { method: "DELETE" });
            if (res.status === 200 || res.status === 204) deleted++;
        } catch {}
    }
    return deleted;
}