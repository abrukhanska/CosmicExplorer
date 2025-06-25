const NASA_API_KEY = process.env.REACT_APP_NASA_API_KEY || "DEMO_KEY";
const NASA_APOD_URL = "https://api.nasa.gov/planetary/apod";
export const APOD_MIN_DATE = "1995-06-16";

export function validateApodDate(date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        throw new Error("Некоректний формат дати (YYYY-MM-DD).");
    }
    const min = new Date(APOD_MIN_DATE);
    const max = new Date();
    const d = new Date(date);
    if (isNaN(d.getTime())) throw new Error("Недійсна дата.");
    if (d < min) throw new Error(`Фото дня доступні лише з ${APOD_MIN_DATE}.`);
    if (d > max) throw new Error("Дата не може бути у майбутньому.");
}

export async function getApodByDate(date) {
    validateApodDate(date);

    const params = new URLSearchParams();
    params.set("api_key", NASA_API_KEY);
    params.set("date", date);

    const url = `${NASA_APOD_URL}?${params.toString()}`;

    let res;
    try {
        res = await fetch(url, { method: "GET" });
    } catch (networkErr) {
        throw new Error("Помилка мережі. Перевірте ваше інтернет-з'єднання.");
    }

    let data;
    try {
        data = await res.json();
    } catch (jsonErr) {
        throw new Error("Помилка обробки відповіді NASA. Спробуйте пізніше.");
    }

    if (!res.ok) {
        if (data && data.error && data.error.message) {
            throw new Error(data.error.message);
        }
        if (res.status === 404) throw new Error("Фото за цю дату не знайдено.");
        if (res.status === 429) throw new Error("Перевищено ліміт NASA API. Спробуйте пізніше.");
        throw new Error(`Сервер NASA повернув помилку: ${res.status} ${res.statusText}`);
    }

    if (!data.url || !data.title) throw new Error("Некоректні дані від NASA API.");

    if (data.media_type !== "image" && data.media_type !== "video") {
        throw new Error("Цей тип медіа не підтримується.");
    }

    if (data.media_type === "image" && !data.hdurl) {
        data.hdurl = data.url;
    }

    if (data.msg) throw new Error(data.msg);

    return {
        url: data.url,
        hdurl: data.hdurl || data.url,
        title: data.title,
        explanation: data.explanation,
        copyright: data.copyright || null,
        media_type: data.media_type,
        date: data.date,
        thumbnail_url: data.thumbnail_url || null,
    };
}

export function getTodayStr() {
    const now = new Date();
    const yyyy = now.getUTCFullYear();
    const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(now.getUTCDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}