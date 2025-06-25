import React, { useContext, useEffect, useState, useCallback, useMemo, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getAllFavorites, removeFavoriteById, removeAllFavorites, cleanDuplicates } from "../api/favorites";
import { FaExpand, FaDownload, FaShareAlt, FaTimesCircle } from "react-icons/fa";
import "./Journal.css";

export default function JournalPage() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [clearLoading, setClearLoading] = useState(false);
    const [sortOrder, setSortOrder] = useState("desc");
    const [search, setSearch] = useState("");
    const [alert, setAlert] = useState(null);
    const [dupLoading, setDupLoading] = useState(false);

    useEffect(() => {
        if (!user) navigate("/login", { replace: true });
    }, [user, navigate]);

    const fetchFavorites = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAllFavorites(user?.email);
            setFavorites(Array.isArray(data) ? data : []);
        } catch (e) {
            setAlert({ type: "danger", message: e.message || "Не вдалося завантажити журнал." });
        } finally {
            setTimeout(() => setLoading(false), 600);
        }
    }, [user]);

    useEffect(() => {
        if (user?.email) fetchFavorites();
    }, [user, fetchFavorites]);

    const handleRemove = async (id) => {
        if (!window.confirm("Видалити це фото з журналу?")) return;
        setLoading(true);
        try {
            await removeFavoriteById(id, user.email);
            setFavorites((prev) => prev.filter((f) => f.id !== id));
            setAlert({ type: "success", message: "Фото видалено з журналу!" });
        } catch (e) {
            setAlert({ type: "danger", message: e.message || "Не вдалося видалити фото." });
        } finally {
            setTimeout(() => setLoading(false), 400);
        }
    };

    const handleClearAll = async () => {
        if (!window.confirm("Очистити увесь журнал? Дію не можна скасувати!")) return;
        setClearLoading(true);
        try {
            await removeAllFavorites(user.email);
            setFavorites([]);
            setAlert({
                type: "success",
                message: "Журнал очищено!",
            });
        } catch (e) {
            setAlert({ type: "danger", message: e.message || "Не вдалося очистити журнал." });
        } finally {
            setClearLoading(false);
        }
    };

    const handleCleanDuplicates = async () => {
        setDupLoading(true);
        try {
            const deleted = await cleanDuplicates(user.email);
            if (deleted > 0) {
                setAlert({ type: "success", message: `Очищено ${deleted} дублікат(и/ів)!` });
                fetchFavorites();
            } else {
                setAlert({ type: "info", message: "Дублікатів не знайдено." });
            }
        } catch (e) {
            setAlert({ type: "danger", message: e.message || "Помилка очистки дублікатів." });
        } finally {
            setDupLoading(false);
        }
    };

    const handleShare = (url) => {
        if (navigator.share) {
            navigator.share({ title: "Фото з журналу", url });
        } else if (navigator?.clipboard) {
            navigator.clipboard.writeText(url);
            setAlert({ type: "success", message: "Посилання скопійовано!" });
        } else {
            setAlert({ type: "warning", message: "Не вдалося скопіювати посилання." });
        }
    };

    const handleDownload = (photoUrl, title) => {
        fetch(photoUrl)
            .then((resp) => resp.blob())
            .then((blob) => {
                const link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                link.download = `${title || "nasa-favorite"}.jpg`;
                document.body.appendChild(link);
                link.click();
                link.remove();
            })
            .catch(() =>
                setAlert({ type: "danger", message: "Не вдалося завантажити фото." })
            );
    };

    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => setAlert(null), 3500);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    useEffect(() => {
        function onKeyDown(e) {
            if (e.key === "Escape" && search) setSearch("");
        }
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [search]);

    const filteredSorted = useMemo(() => {
        let arr = favorites;
        if (search) {
            arr = arr.filter(
                (fav) =>
                    fav.title?.toLowerCase().includes(search.toLowerCase()) ||
                    fav.date?.includes(search) ||
                    (fav.explanation && fav.explanation.toLowerCase().includes(search.toLowerCase()))
            );
        }
        arr = arr.sort((a, b) =>
            sortOrder === "desc"
                ? b.date.localeCompare(a.date)
                : a.date.localeCompare(b.date)
        );
        return arr;
    }, [favorites, search, sortOrder]);

    function highlight(text, query) {
        if (!query || !text) return text;
        const parts = text.split(new RegExp(`(${query})`, "gi"));
        return parts.map((part, i) =>
            part.toLowerCase() === query.toLowerCase() ? <mark key={i}>{part}</mark> : part
        );
    }

    const duplicateDates = useMemo(() => {
        const seen = new Set(), dups = new Set();
        for (const f of favorites) {
            if (seen.has(f.date)) dups.add(f.date);
            else seen.add(f.date);
        }
        return Array.from(dups);
    }, [favorites]);

    return (
        <main className="journal-root">
            <div className="mars-glowbar"></div>
            <section className="journal-bar" aria-label="Панель фільтрів журналу">
                <div className="journal-bar-group">
                    <button
                        className="journal-bar-input"
                        onClick={() => setSortOrder((o) => (o === "desc" ? "asc" : "desc"))}
                        aria-label="Змінити сортування"
                    >
                        {sortOrder === "desc" ? "Новіші спочатку" : "Старіші спочатку"}
                    </button>
                    <input
                        className="journal-bar-input"
                        type="text"
                        placeholder="Пошук по назві, даті, опису..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        aria-label="Пошук у журналі"
                    />
                </div>
                <div className="journal-bar-group">
                    <button
                        className="journal-bar-input"
                        onClick={handleClearAll}
                        disabled={clearLoading || favorites.length === 0}
                    >
                        {clearLoading ? "Очищення..." : "Очистити все"}
                    </button>
                    <button
                        className="journal-bar-input"
                        onClick={handleCleanDuplicates}
                        disabled={dupLoading || duplicateDates.length === 0}
                    >
                        {dupLoading
                            ? "Очищення дублікатів..."
                            : `Очистити дублікати (${duplicateDates.length})`}
                    </button>
                </div>
            </section>
            {alert && (
                <div className="journal-alert" aria-live="polite">
                    {alert.message}
                </div>
            )}
            {duplicateDates.length > 0 && !dupLoading && (
                <div className="journal-alert-warning" role="alert">
                    У журналі знайдено <b>{duplicateDates.length}</b> дублікатів дат.<br />
                    Можна очистити дублікати окремою кнопкою.
                </div>
            )}
            <section className="journal-grid-wrap">
                {loading ? (
                    <div className="journal-loader"><div className="mars-gallery-fav-spinner" /></div>
                ) : filteredSorted.length === 0 ? (
                    <div className="journal-empty">
                        Журнал порожній.<br />
                        Додавайте фото із галереї, натиснувши зірочку на фото!
                    </div>
                ) : (
                    <div className="journal-grid">
                        {filteredSorted.map((fav) => (
                            <div className="journal-card cosmic-glow" key={fav.id}>
                                <img
                                    className="journal-img"
                                    src={fav.photoUrl}
                                    alt={fav.title}
                                />
                                <div className="journal-card-bar">
                                    <div>
                                        <div className="journal-title">{highlight(fav.title, search)}</div>
                                        <div className="journal-date">{highlight(fav.date, search)}</div>
                                    </div>
                                </div>
                                <div className="journal-card-btns">
                                    <a
                                        className="journal-btn"
                                        href={fav.photoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Переглянути повністю"
                                        aria-label="Переглянути повністю"
                                    >
                                        <FaExpand />
                                    </a>
                                    <button
                                        className="journal-btn"
                                        title="Поділитися"
                                        aria-label="Поділитися"
                                        onClick={() => handleShare(fav.photoUrl)}
                                    >
                                        <FaShareAlt />
                                    </button>
                                    <button
                                        className="journal-btn"
                                        title="Завантажити"
                                        aria-label="Завантажити фото"
                                        onClick={() => handleDownload(fav.photoUrl, fav.title)}
                                    >
                                        <FaDownload />
                                    </button>
                                    <button
                                        className="journal-btn"
                                        title="Видалити з журналу"
                                        aria-label="Видалити з журналу"
                                        onClick={() => handleRemove(fav.id)}
                                    >
                                        <FaTimesCircle />
                                    </button>
                                </div>
                                <div className="journal-desc">{highlight(fav.explanation, search)}</div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}