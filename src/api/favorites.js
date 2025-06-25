const API_URL =
    process.env.REACT_APP_FAVORITES_API_URL ||
    "https://json-server-cosmic-explorer.glitch.me/api/favorites";

// Додаємо фото в улюблені
export async function addFavorite(photo, userEmail) {
    if (!userEmail) throw new Error("Авторизація обов'язкова.");
    const err = validateFavoritePhoto(photo);
    if (err) throw new Error(err);

    // Перевірка наявності дублікату (по date+userEmail)
    const exists = await isFavorite(photo.date, userEmail);
    if (exists)
        throw new Error(
            "Це фото вже у вашому журналі. Якщо є дублікати — перейдіть у журнал для очищення."
        );

    const payload = {
        userEmail,
        photoUrl: photo.photoUrl,
        title: photo.title || "",
        date: photo.date,
        explanation: photo.explanation || "",
    };

    let res;
    try {
        res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
    } catch (e) {
        throw new Error("Помилка мережі. Будь ласка, перевірте підключення.");
    }

    if (res.status === 201) {
        return await res.json();
    } else if (res.status === 409) {
        throw new Error("Це фото вже у вашому журналі.");
    } else if (res.status === 400) {
        throw new Error("Некоректні дані. Перевірте вибране фото.");
    } else if (!res.ok) {
        throw new Error("Не вдалося додати фото. Спробуйте пізніше.");
    }
}

// Видалити одне фото (по id)
export async function removeFavoriteById(id, userEmail) {
    if (!id) throw new Error("Некоректний id фото.");
    if (!userEmail) throw new Error("Авторизація обов'язкова.");

    // Перевірка що це фото user'а
    const fav = await getFavoriteById(id);
    if (!fav) throw new Error("Фото не знайдено.");
    if (fav.userEmail !== userEmail)
        throw new Error("Ви не маєте права видаляти це фото.");

    let res;
    try {
        res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    } catch {
        throw new Error("Не вдалося видалити фото. Спробуйте пізніше.");
    }
    if (res.status === 200 || res.status === 204) return true;
    throw new Error("Не вдалося видалити фото.");
}

// Видалити одне фото (по даті)
export async function removeFavoriteByDate(date, userEmail) {
    if (!date) throw new Error("Дата не вказана.");
    if (!userEmail) throw new Error("Авторизація обов'язкова.");
    const fav = await getFavoriteByDate(date, userEmail);
    if (!fav) throw new Error("Фото за цю дату не знайдено у журналі.");
    return await removeFavoriteById(fav.id, userEmail);
}

// Видалити всі улюблені користувача
export async function removeAllFavorites(userEmail) {
    if (!userEmail) throw new Error("Авторизація обов'язкова.");
    const allFavs = await getAllFavorites(userEmail);
    let deleted = 0;
    for (const fav of allFavs) {
        try {
            const res = await fetch(`${API_URL}/${fav.id}`, { method: "DELETE" });
            if (res.status === 200 || res.status === 204) deleted += 1;
        } catch {}
    }
    if (deleted === 0)
        throw new Error("Не вдалося видалити жодного фото. Спробуйте пізніше.");
    return deleted;
}

// Отримати всі улюблені користувача
export async function getAllFavorites(userEmail) {
    if (!userEmail) throw new Error("Авторизація обов'язкова.");
    const url = `${API_URL}?userEmail=${encodeURIComponent(userEmail)}`;
    let res;
    try {
        res = await fetch(url, { method: "GET" });
    } catch (e) {
        throw new Error("Помилка мережі. Будь ласка, перевірте підключення.");
    }
    if (!res.ok) throw new Error("Не вдалося отримати журнал. Спробуйте пізніше.");
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Некоректні дані журналу.");
    return data;
}

// Отримати всі улюблені для дати
export async function getAllFavoritesByDate(date, userEmail) {
    if (!date || !userEmail) return [];
    const url = `${API_URL}?date=${encodeURIComponent(date)}&userEmail=${encodeURIComponent(
        userEmail
    )}`;
    let res;
    try {
        res = await fetch(url, { method: "GET" });
    } catch {
        return [];
    }
    if (!res.ok) return [];
    return await res.json();
}

// Отримати улюблене фото для дати (перший збіг)
export async function getFavoriteByDate(date, userEmail) {
    const arr = await getAllFavoritesByDate(date, userEmail);
    if (arr.length === 0) return false;
    if (arr.length > 1) {
        // Увага: дублікат по даті — можна викликати cleanDuplicates
        console.warn(`Дублікати favorites для дати ${date} і ${userEmail}`);
    }
    return arr[0];
}

// Отримати одне фото по id
export async function getFavoriteById(id) {
    if (!id) return null;
    let res;
    try {
        res = await fetch(`${API_URL}/${id}`, { method: "GET" });
    } catch {
        return null;
    }
    if (!res.ok) return null;
    return await res.json();
}

// Перевірити, чи фото в улюблених (по даті)
export async function isFavorite(date, userEmail) {
    const fav = await getFavoriteByDate(date, userEmail);
    return !!fav;
}

// Очистити всі дублікати по даті для користувача
export async function cleanDuplicates(userEmail) {
    if (!userEmail) throw new Error("Авторизація обов'язкова.");
    const allFavs = await getAllFavorites(userEmail);
    const seen = {};
    let deleted = 0;
    for (const fav of allFavs) {
        if (!fav.date) continue;
        const key = fav.date;
        if (!seen[key]) {
            seen[key] = fav.id;
        } else {
            try {
                const res = await fetch(`${API_URL}/${fav.id}`, { method: "DELETE" });
                if (res.status === 200 || res.status === 204) deleted++;
            } catch {}
        }
    }
    return deleted;
}

// Валідація фото
export function validateFavoritePhoto(photo) {
    if (!photo || typeof photo !== "object")
        return "Передано невалідний об'єкт фото.";
    if (!photo.photoUrl || typeof photo.photoUrl !== "string")
        return "Некоректне або відсутнє посилання на фото.";
    if (!photo.date || !/^\d{4}-\d{2}-\d{2}$/.test(photo.date))
        return "Некоректна або відсутня дата фото.";
    return null;
}