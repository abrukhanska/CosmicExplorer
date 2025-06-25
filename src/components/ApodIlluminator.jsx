import React, { useState, useRef } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import {
    FaStar,
    FaRegStar,
    FaDownload,
    FaShareAlt,
    FaRegCalendar,
} from "react-icons/fa";
import { MdInfoOutline } from "react-icons/md";
import ApodDrawer from "./ApodDrawer";
import "./ApodIluminator.css";

export default function ApodIlluminator({
                                            data,
                                            loading,
                                            isStarred,
                                            starLoading,
                                            onStar,
                                            onShare,
                                            onShowCalendar,
                                            user,
                                        }) {
    const [imgLoaded, setImgLoaded] = useState(false);
    const [showDesc, setShowDesc] = useState(false);
    const descButtonRef = useRef(null);

    function renderImageOrSkeleton() {
        if (loading) {
            return (
                <div className="apod-main-skeleton">
                    <div className="apod-main-skeleton-img" />
                </div>
            );
        }
        if (data && data.media_type === "image") {
            return (
                <img
                    src={data.hdurl}
                    alt={data.title}
                    className={"apod-main-img" + (imgLoaded ? " loaded" : "")}
                    onLoad={() => setImgLoaded(true)}
                    style={{ opacity: imgLoaded ? 1 : 0, transition: "opacity 0.45s" }}
                />
            );
        }
        if (data && data.media_type === "video") {
            return (
                <iframe
                    src={data.url}
                    title={data.title}
                    className="apod-main-img"
                    allow="encrypted-media; fullscreen"
                    style={{ background: "#1a1a2a" }}
                />
            );
        }
        return <div className="apod-main-noimg">Немає фото</div>;
    }

    return (
        <div className="apod-main-root">
            <div className="apod-main-img-wrapper">
                {renderImageOrSkeleton()}
                <div className="apod-main-bottombar">
                    <div>
                        <span className="apod-main-project">APOD PROJECT</span>
                        <span className="apod-main-title">{data?.title}</span>
                    </div>
                    <div className="apod-main-actions">
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Вибрати дату</Tooltip>}
                        >
                            <button
                                className="apod-main-btn"
                                onClick={onShowCalendar}
                                aria-label="Вибрати дату"
                            >
                                <FaRegCalendar />
                            </button>
                        </OverlayTrigger>
                        <OverlayTrigger
                            placement="top"
                            overlay={
                                <Tooltip>
                                    {user
                                        ? isStarred
                                            ? "Видалити з журналу"
                                            : "Додати в журнал"
                                        : "Авторизуйтесь для журналу"}
                                </Tooltip>
                            }
                        >
                            <button
                                className="apod-main-btn"
                                onClick={onStar}
                                aria-label={isStarred ? "Видалити з журналу" : "Додати в журнал"}
                                disabled={starLoading || !user}
                            >
                                {isStarred ? <FaStar color="#A784E6" /> : <FaRegStar />}
                            </button>
                        </OverlayTrigger>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Завантажити</Tooltip>}
                        >
                            <a
                                href={data?.hdurl}
                                className="apod-main-btn"
                                aria-label="Завантажити"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: "none" }}
                            >
                                <FaDownload />
                            </a>
                        </OverlayTrigger>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Поділитися</Tooltip>}
                        >
                            <button
                                className="apod-main-btn"
                                onClick={onShare}
                                aria-label="Поділитися"
                            >
                                <FaShareAlt />
                            </button>
                        </OverlayTrigger>
                        <OverlayTrigger
                            placement="top"
                            overlay={
                                <Tooltip>
                                    {showDesc ? "Сховати опис" : "Показати опис"}
                                </Tooltip>
                            }
                        >
                            <button
                                className="apod-main-btn"
                                ref={descButtonRef}
                                onClick={() => setShowDesc((v) => !v)}
                                aria-label="Деталі"
                                aria-pressed={showDesc}
                                style={showDesc ? { background: "#21213b" } : {}}
                            >
                                <MdInfoOutline style={showDesc ? { color: "#ffd700" } : {}} />
                            </button>
                        </OverlayTrigger>
                    </div>
                </div>
                {showDesc && (
                    <ApodDrawer onClose={() => setShowDesc(false)}>
                        <h2>{data?.title}</h2>
                        <div className="apod-drawer-date">{data?.date}</div>
                        <div className="apod-drawer-explanation">{data?.explanation}</div>
                        {data?.copyright &&
                            <div className="apod-drawer-copyright">&copy; {data?.copyright}</div>
                        }
                    </ApodDrawer>
                )}
            </div>
        </div>
    );
}