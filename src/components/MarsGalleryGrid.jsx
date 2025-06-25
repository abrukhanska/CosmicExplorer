import React from "react";
import { FaStar, FaRegStar, FaDownload, FaExpand, FaShareAlt } from "react-icons/fa";

export default function MarsGalleryGrid({ photos, loading, onStar, favorites, favLoading, user, formatDate }) {
    if (loading)
        return <section className="mars-gallery-loader" aria-busy="true">
            <div className="apod-main-skeleton"><div className="apod-main-skeleton-img" /></div>
        </section>;
    if (!photos.length)
        return <section className="mars-gallery-empty" aria-live="polite">Фото не знайдено</section>;
    return (
        <section className="mars-gallery-grid" aria-label="Галерея марсіанських фото">
            {photos.map(photo => (
                <article className="mars-gallery-card" key={photo.id} tabIndex={0} aria-label={`Фото ${photo.earth_date}`}>
                    <img
                        src={photo.img_src}
                        alt={photo.camera.full_name}
                        className="mars-gallery-img"
                        loading="lazy"
                        draggable={false}
                    />
                    <div className="mars-gallery-card-bar">
                        <span className="mars-gallery-title">{photo.rover.name}: {photo.camera.name}</span>
                        <span className="mars-gallery-date">{formatDate(photo.earth_date)}</span>
                    </div>
                    <div className="mars-gallery-actions">
                        <a
                            className="mars-gallery-btn"
                            href={photo.img_src}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Переглянути повністю"
                            aria-label="Переглянути повністю"
                        >
                            <FaExpand />
                        </a>
                        <a
                            className="mars-gallery-btn"
                            href={photo.img_src}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Завантажити"
                            aria-label="Завантажити фото"
                        >
                            <FaDownload />
                        </a>
                        <button
                            className="mars-gallery-btn"
                            title="Поділитися"
                            aria-label="Поділитися"
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({ title: photo.rover.name, url: photo.img_src });
                                } else {
                                    navigator.clipboard.writeText(photo.img_src);
                                    alert("Посилання скопійовано!");
                                }
                            }}
                        >
                            <FaShareAlt />
                        </button>
                        <button
                            className="mars-gallery-btn"
                            onClick={() => onStar(photo)}
                            disabled={!user || favLoading[photo.id]}
                            title={favorites[photo.id] ? "Видалити з журналу" : "Додати в журнал"}
                            aria-label={favorites[photo.id] ? "Видалити з журналу" : "Додати в журнал"}
                            aria-pressed={!!favorites[photo.id]}
                            tabIndex={0}
                        >
                            {favLoading[photo.id]
                                ? <span className="mars-gallery-fav-spinner" aria-label="Завантаження" />
                                : (favorites[photo.id] ? <FaStar color="#A784E6" /> : <FaRegStar />)
                            }
                        </button>
                    </div>
                </article>
            ))}
        </section>
    );
}