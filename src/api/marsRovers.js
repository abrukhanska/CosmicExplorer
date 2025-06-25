const NASA_API_KEY = process.env.REACT_APP_NASA_API_KEY || "DEMO_KEY";
const NASA_MARS_URL = "https://api.nasa.gov/mars-photos/api/v1/rovers";
const NASA_MANIFEST_URL = "https://api.nasa.gov/mars-photos/api/v1/manifests";

export const MARS_ROVER_DATES = {
    Curiosity:     { min: "2012-08-06", max: new Date().toISOString().slice(0, 10) },
    Perseverance:  { min: "2021-02-18", max: new Date().toISOString().slice(0, 10) }
    // Opportunity та Spirit видалено
};

export const MARS_MIN_DATE = MARS_ROVER_DATES.Curiosity.min;
export const MARS_MAX_DATE = MARS_ROVER_DATES.Curiosity.max;

export const MARS_ROVERS = [
    { name: "Curiosity", cameras: ["FHAZ", "RHAZ", "MAST", "CHEMCAM", "MAHLI", "MARDI", "NAVCAM"] },
    { name: "Perseverance", cameras: ["EDL_RUCAM", "EDL_RDCAM", "EDL_DDCAM", "EDL_PUCAM1", "EDL_PUCAM2", "NAVCAM_LEFT", "NAVCAM_RIGHT", "MCZ_RIGHT", "MCZ_LEFT", "FRONT_HAZCAM_LEFT_A", "FRONT_HAZCAM_RIGHT_A", "REAR_HAZCAM_LEFT", "REAR_HAZCAM_RIGHT", "SKYCAM", "SHERLOC_WATSON", "SUPERCAM_RMI"] }
    // Opportunity та Spirit видалено
];

// Отримати всі дати, де є фото для обраного ровера/камери
export async function getAvailableDatesForFilter({ rover = "Curiosity", camera = "" }) {
    if (rover === "Perseverance") {
        // Perseverance manifest API не існує — повертаємо весь діапазон
        const { min, max } = MARS_ROVER_DATES.Perseverance;
        const result = [];
        let current = new Date(min);
        const end = new Date(max);
        while (current <= end) {
            result.push(current.toISOString().slice(0, 10));
            current.setDate(current.getDate() + 1);
        }
        return result;
    }

    // Для Curiosity — manifest API!
    const params = new URLSearchParams();
    params.set("api_key", NASA_API_KEY);
    const url = `${NASA_MANIFEST_URL}/${rover.toLowerCase()}?${params.toString()}`;

    let res, text, data;
    try {
        res = await fetch(url);
    } catch (e) {
        throw new Error("Помилка мережі. Перевірте інтернет.");
    }

    try {
        text = await res.text();
        if (!res.headers.get("content-type") || !res.headers.get("content-type").includes("application/json")) {
            throw new Error("NASA API повернув не JSON: " + text.slice(0,160));
        }
        data = JSON.parse(text);
    } catch (e) {
        throw new Error("Помилка даних NASA API. " + (text ? ("Сервер повернув: " + text.slice(0,160)) : ""));
    }

    if (!res.ok || !data.photo_manifest) {
        let msg = (data && data.error && data.error.message) || res.statusText || text;
        throw new Error(msg || "Помилка manifest API.");
    }
    let dates = [];
    if (data.photo_manifest && data.photo_manifest.photos) {
        if (camera) {
            dates = data.photo_manifest.photos
                .filter(ph => ph.cameras.includes(camera))
                .map(ph => ph.earth_date);
        } else {
            dates = data.photo_manifest.photos.map(ph => ph.earth_date);
        }
    }
    return dates;
}

// Отримати фото з NASA API для конкретного ровера, дати, камери й сторінки
export async function getMarsPhotos({ rover = "Curiosity", camera = "", date = "", page = 1 }) {
    const params = new URLSearchParams();
    params.set("api_key", NASA_API_KEY);
    if (camera) params.set("camera", camera);
    if (date) params.set("earth_date", date);
    params.set("page", String(page));
    const url = `${NASA_MARS_URL}/${rover.toLowerCase()}/photos?${params.toString()}`;

    let res, text, data;
    try {
        res = await fetch(url);
    } catch {
        throw new Error("Помилка мережі. Перевірте інтернет.");
    }
    try {
        text = await res.text();
        if (!res.headers.get("content-type") || !res.headers.get("content-type").includes("application/json")) {
            throw new Error("NASA API повернув не JSON: " + text.slice(0,160));
        }
        data = JSON.parse(text);
    } catch {
        throw new Error("Помилка даних NASA API. " + (text ? "Сервер повернув: " + text.slice(0,160) : ""));
    }
    if (!res.ok) {
        let msg = (data && data.error && data.error.message) || res.statusText || text;
        throw new Error(msg || "Помилка API.");
    }
    return data.photos || [];
}