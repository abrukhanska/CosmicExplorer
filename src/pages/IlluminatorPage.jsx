import React, { useState, useEffect, useCallback, useRef } from "react";
import { getApodByDate, getTodayStr, APOD_MIN_DATE } from "../api/nasa";
import { addFavorite, removeFavoriteByDate, isFavorite } from "../api/favorites";
import { useAuth } from "../context/AuthContext";
import ApodIlluminator from "../components/ApodIlluminator";
import CalendarModal from "../components/CalendarModal";
import Alert from "react-bootstrap/Alert";

export default function IlluminatorPage() {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [selectedDate, setSelectedDate] = useState(getTodayStr());
    const [loading, setLoading] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false);
    const [isStarred, setIsStarred] = useState(false);
    const [starLoading, setStarLoading] = useState(false);
    const [alert, setAlert] = useState("");
    const [showDesc, setShowDesc] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const alertTimer = useRef(null);
    const descButtonRef = useRef();

    const startY = useRef(null);

    const fetchData = useCallback(async (date) => {
        setLoading(true);
        setImgLoaded(false);
        setAlert("");
        try {
            const apod = await getApodByDate(date);
            setData(apod);
            if (user?.email) {
                setIsStarred(await isFavorite(date, user.email));
            } else {
                setIsStarred(false);
            }
        } catch (e) {
            showAlert(e.message);
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchData(selectedDate);
    }, [fetchData, selectedDate]);

    async function handleStar() {
        if (!user?.email) {
            showAlert("Авторизуйтесь для журналу!");
            return;
        }
        if (!data || data.media_type !== "image") return;
        setStarLoading(true);
        try {
            if (!isStarred) {
                await addFavorite({
                    photoUrl: data.hdurl,
                    date: data.date,
                    title: data.title,
                    explanation: data.explanation,
                }, user.email);
                setIsStarred(true);
                showAlert("Додано в журнал!");
            } else {
                await removeFavoriteByDate(data.date, user.email);
                setIsStarred(false);
                showAlert("Видалено з журналу.");
            }
        } catch (e) {
            showAlert(e.message || "Помилка.");
        } finally {
            setStarLoading(false);
        }
    }

    function handleDownload() {
        if (!data?.hdurl) return;
        const link = document.createElement("a");
        link.href = data.hdurl;
        link.download = data.title?.replace(/[^\w\-.]+/g, "_") || "apod.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    function handleShare() {
        if (!data?.hdurl) return;
        const shareData = {
            title: data.title,
            text: data.explanation,
            url: data.hdurl,
        };
        if (navigator.share) {
            navigator.share(shareData)
                .catch(() => showAlert("Не вдалося поділитися. Спробуйте вручну."));
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(data.hdurl);
            showAlert("Посилання скопійовано у буфер!");
        } else {
            window.prompt("Скопіюйте це посилання:", data.hdurl);
        }
    }

    function handleShowCalendar() {
        setShowCalendar(true);
    }
    function handleSelectDate(newDate) {
        setShowCalendar(false);
        setSelectedDate(newDate);
    }

    function handleShowDesc() {
        setShowDesc(true);
        setTimeout(() => {
            const el = document.getElementById("apod-desc-sidebar");
            if (el) el.focus();
        }, 150);
    }
    function handleHideDesc() {
        setShowDesc(false);
        if (descButtonRef.current) descButtonRef.current.focus();
    }
    useEffect(() => {
        if (!showDesc) return;
        function onKey(e) {
            if (e.key === "Escape") handleHideDesc();
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [showDesc]);
    function handleSidebarTouchStart(e) {
        if (e.touches && e.touches.length === 1) startY.current = e.touches[0].clientY;
    }
    function handleSidebarTouchMove(e) {
        if (!startY.current) return;
        const deltaY = e.touches[0].clientY - startY.current;
        if (deltaY > 90) { // свайп вниз
            handleHideDesc();
            startY.current = null;
        }
    }
    function handleSidebarTouchEnd() {
        startY.current = null;
    }

    function showAlert(msg) {
        setAlert(msg);
        if (alertTimer.current) clearTimeout(alertTimer.current);
        alertTimer.current = setTimeout(() => setAlert(""), 3500);
    }

    function handleCalendarDate(newDate) {
        const selected = typeof newDate === "string" ? new Date(newDate) : newDate;
        const today = new Date();
        selected.setHours(0,0,0,0);
        today.setHours(0,0,0,0);
        if (selected > today) {
            showAlert("Дата не може бути у майбутньому!");
            return;
        }
        handleSelectDate(
            typeof newDate === "string" ? newDate : selected.toISOString().slice(0,10)
        );
    }

    return (
        <div>
            <ApodIlluminator
                data={data}
                loading={loading}
                imgLoaded={imgLoaded}
                setImgLoaded={setImgLoaded}
                isStarred={isStarred}
                starLoading={starLoading}
                onStar={handleStar}
                onDownload={handleDownload}
                onShare={handleShare}
                onShowCalendar={handleShowCalendar}
                showDesc={showDesc}
                onShowDesc={handleShowDesc}
                descButtonRef={descButtonRef}
                user={user}
            />
            {showDesc && data &&
                <ApodSidebar
                    data={data}
                    onClose={handleHideDesc}
                    onTouchStart={handleSidebarTouchStart}
                    onTouchMove={handleSidebarTouchMove}
                    onTouchEnd={handleSidebarTouchEnd}
                />
            }
            <CalendarModal
                show={showCalendar}
                onHide={() => setShowCalendar(false)}
                date={selectedDate}
                min={APOD_MIN_DATE}
                max={getTodayStr()}
                onSelect={handleCalendarDate}
            />
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
        </div>
    );
}

function ApodSidebar({ data, onClose, onTouchStart, onTouchMove, onTouchEnd }) {
    return (
        <div
            id="apod-desc-sidebar"
            className="apod-drawer"
            tabIndex={-1}
            aria-modal="true"
            role="dialog"
            style={{animation: "apodDrawerIn 300ms cubic-bezier(.42,0,.58,1)"}}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            <button className="apod-drawer-close" aria-label="Закрити опис" onClick={onClose}>
                <i className="fa-solid fa-xmark"></i>
            </button>
            <h2>{data.title}</h2>
            <div className="apod-drawer-date">{data.date}</div>
            <div className="apod-drawer-explanation">{data.explanation}</div>
            {data.copyright &&
                <small className="apod-drawer-copyright">© {data.copyright}</small>
            }
            <div className="apod-drawer-swipehint d-md-none">Проведіть вниз для закриття</div>
        </div>
    );
}