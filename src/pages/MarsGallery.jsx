import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    getMarsPhotos,
    getAvailableDatesForFilter,
    MARS_ROVERS,
} from "../api/marsRovers";
import {
    addFavorite,
    removeFavoriteByDate,
    isFavorite,
} from "../api/favorites";
import { useAuth } from "../context/AuthContext";
import Alert from "react-bootstrap/Alert";
import MarsGalleryGrid from "../components/MarsGalleryGrid";
import MarsDateSelect from "../components/MarsDateSelect";
import "./MarsGallery.css";

function formatDate(dateStr) {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}.${m}.${y}`;
}

async function findLatestPhotoDate({ rover, camera, availableDates }) {
    let arr = Array.from(availableDates || []);
    arr.sort((a, b) => b.localeCompare(a));
    for (let d of arr) {
        const photos = await getMarsPhotos({ rover, camera, date: d, page: 1 });
        if (photos && photos.length) return { date: d, photos };
    }
    return { date: "", photos: [] };
}

export default function MarsGallery() {
    const { user } = useAuth();
    const userEmail = user?.email || null;

    const [rover, setRover] = useState("Curiosity");
    const [camera, setCamera] = useState("");
    const [date, setDate] = useState(""); // yyyy-mm-dd
    const [sort, setSort] = useState("new");
    const [page, setPage] = useState(1);

    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState("");
    const [autoDateNotice, setAutoDateNotice] = useState("");
    const [favorites, setFavorites] = useState({});
    const [favLoading, setFavLoading] = useState({});
    const [availableDates, setAvailableDates] = useState(new Set());
    const alertTimer = useRef(null);

    useEffect(() => {
        let cancelled = false;
        setAvailableDates(new Set());
        (async () => {
            const dates = await getAvailableDatesForFilter({ rover, camera });
            if (!cancelled) setAvailableDates(new Set(dates));
        })();
        return () => { cancelled = true };
    }, [rover, camera]);

    const fetchPhotos = useCallback(async () => {
        setLoading(true);
        setAlert("");
        setAutoDateNotice("");
        try {
            let items = [];
            if (date && availableDates.has(date)) {
                items = await getMarsPhotos({ rover, camera, date, page });
            }
            if ((!items || !items.length) && availableDates.size) {
                const { date: foundDate, photos: foundPhotos } = await findLatestPhotoDate({ rover, camera, availableDates });
                if (foundPhotos.length) {
                    setAutoDateNotice(`Фото за обрану дату не знайдено, показуємо за ${formatDate(foundDate)}`);
                    setDate(foundDate);
                    setPhotos(sort === "old" ? foundPhotos : [...foundPhotos].reverse());
                    setPage(1);
                    setLoading(false);
                    return;
                } else {
                    // fallback до дефолтного Curiosity
                    const allDates = await getAvailableDatesForFilter({ rover: "Curiosity", camera: "" });
                    const { date: defaultDate, photos: defaultPhotos } = await findLatestPhotoDate({ rover: "Curiosity", camera: "", availableDates: new Set(allDates) });
                    setAutoDateNotice("Фото не знайдено, показуємо найновіші з Curiosity");
                    setRover("Curiosity");
                    setCamera("");
                    setDate(defaultDate);
                    setPhotos(defaultPhotos);
                    setPage(1);
                    setLoading(false);
                    return;
                }
            }
            setPhotos(sort === "old" ? items : [...items].reverse());
        } catch (e) {
            setAlert(e.message);
            setPhotos([]);
        } finally {
            setLoading(false);
        }
    }, [rover, camera, date, page, sort, availableDates]);

    useEffect(() => { fetchPhotos(); }, [rover, camera, date, page, sort, availableDates, fetchPhotos]);

    useEffect(() => {
        if (!userEmail || !photos.length) {
            setFavorites({});
            return;
        }
        let mounted = true;
        (async () => {
            const favs = {};
            for (const photo of photos) {
                if (photo.earth_date) {
                    favs[photo.id] = await isFavorite(photo.earth_date, userEmail);
                }
            }
            if (mounted) setFavorites(favs);
        })();
        return () => { mounted = false; };
    }, [photos, userEmail]);

    function showAlert(msg) {
        setAlert(msg);
        if (alertTimer.current) clearTimeout(alertTimer.current);
        alertTimer.current = setTimeout(() => setAlert(""), 3500);
    }

    async function handleStar(photo) {
        if (!userEmail) {
            showAlert("Авторизуйтесь для журналу!");
            return;
        }
        const isFav = favorites[photo.id];
        setFavLoading(fl => ({ ...fl, [photo.id]: true }));
        try {
            if (!isFav) {
                await addFavorite({
                    photoUrl: photo.img_src,
                    date: photo.earth_date,
                    title: `[${photo.rover.name}] ${photo.camera.full_name}`,
                    explanation: photo.rover.name + " " + photo.camera.full_name,
                }, userEmail);
                setFavorites(f => ({ ...f, [photo.id]: true }));
                showAlert("Додано в журнал!");
            } else {
                await removeFavoriteByDate(photo.earth_date, userEmail);
                setFavorites(f => ({ ...f, [photo.id]: false }));
                showAlert("Видалено з журналу.");
            }
        } catch (e) {
            showAlert(e.message || "Помилка.");
        } finally {
            setFavLoading(fl => ({ ...fl, [photo.id]: false }));
        }
    }

    function handleSelectDate(newDate) {
        setDate(newDate);
        setPage(1);
    }

    const ROVERS = MARS_ROVERS.filter(r => r.name === "Curiosity" || r.name === "Perseverance");

    return (
        <main className="mars-gallery-root">
            <div className="mars-glowbar"></div>
            <nav className="mars-gallery-bar" aria-label="Фільтри галереї">
                <div className="mars-gallery-bar-group">
                    <select
                        value={rover}
                        onChange={e => { setRover(e.target.value); setCamera(""); setPage(1); }}
                        aria-label="Оберіть ровер"
                        className="mars-gallery-bar-input"
                    >
                        {ROVERS.map(r => (<option key={r.name} value={r.name}>{r.name}</option>))}
                    </select>
                    <select
                        value={camera}
                        onChange={e => { setCamera(e.target.value); setPage(1); }}
                        aria-label="Оберіть камеру"
                        className="mars-gallery-bar-input"
                    >
                        <option value="">Всі камери</option>
                        {ROVERS.find(r => r.name === rover)?.cameras.map(cam =>
                            <option key={cam} value={cam}>{cam}</option>
                        )}
                    </select>
                </div>
                <div className="mars-gallery-bar-group">
                    <MarsDateSelect
                        availableDates={availableDates}
                        selectedDate={date}
                        onSelect={handleSelectDate}
                        className="mars-gallery-bar-input"
                    />
                    <select
                        value={sort}
                        onChange={e => setSort(e.target.value)}
                        aria-label="Сортувати"
                        className="mars-gallery-bar-input"
                    >
                        <option value="new">Новіші спочатку</option>
                        <option value="old">Старіші спочатку</option>
                    </select>
                </div>
            </nav>
            {autoDateNotice && (
                <div className="mars-gallery-notice">{autoDateNotice}</div>
            )}
            <MarsGalleryGrid
                photos={photos}
                loading={loading}
                onStar={handleStar}
                favorites={favorites}
                favLoading={favLoading}
                user={user}
                formatDate={formatDate}
            />
            {!loading && <nav className="mars-gallery-pagination" aria-label="Пагінація">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    aria-label="Попередня сторінка"
                >←</button>
                <span>Сторінка {page}</span>
                <button
                    disabled={photos.length < 25}
                    onClick={() => setPage(p => p + 1)}
                    aria-label="Наступна сторінка"
                >→</button>
            </nav>}
            <div className="apod-alert-abs" aria-live="polite">
                {alert && (
                    <Alert
                        variant="info"
                        onClose={() => setAlert("")}
                        dismissible
                        show={!!alert}
                        className="apod-alert"
                    >
                        {alert}
                    </Alert>
                )}
            </div>
        </main>
    );
}