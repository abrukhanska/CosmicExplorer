import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllFavorites } from "../api/favorites";
import { getMarsPhotos } from "../api/marsRovers";
import { useQuizzes } from "../components/useQuizzes";
import { getTodayStr, getApodByDate } from "../api/nasa";
import planetsData from "../components/planets/data/planetsData";
import "./SearchResults.css";

const issSearchEntry = {
    id: "iss",
    name: "Міжнародна космічна станція",
    desc: "Міжнародна космічна станція (МКС, ISS) — діюча орбітальна наукова станція на низькій навколоземній орбіті. В реальному часі: положення, швидкість, висота.",
    keywords: [
        "МКС", "ISS", "Міжнародна космічна станція", "орбітальна станція", "орбітальна", "космічна станція",
        "orbital", "station", "international space station", "space station", "ISS location", "ISS tracker"
    ],
    img: ""
};

function useQueryParams() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

function normalize(s) {
    return (s || "")
        .toLowerCase()
        .replace(/[\[\]:()\-_.]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function highlight(text, query) {
    if (!query || !text) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? <mark key={i}>{part}</mark> : part
    );
}

function matchesQuery(str, query) {
    if (!str || !query) return false;
    const normStr = normalize(str);
    const normQuery = normalize(query);
    return normStr.includes(normQuery) || normQuery.includes(normStr);
}

function getRecentDates(count = 10) {
    const dates = [];
    let curr = new Date();
    for (let i = 0; i < count; i++) {
        dates.push(curr.toISOString().slice(0, 10));
        curr.setDate(curr.getDate() - 1);
    }
    return dates;
}

function ApodCard({ item, query }) {
    return (
        <div className="apod-search-card">
            {item.img && (
                <img className="apod-search-card-img" src={item.img} alt={item.title} />
            )}
            <div className="apod-search-card-info">
                <div className="apod-search-card-title">{highlight(item.title, query)}</div>
                <div className="apod-search-card-desc">{highlight(item.desc, query)}</div>
                <div className="apod-search-card-date">{item.date}</div>
                <div className="apod-search-card-type">Фото дня</div>
            </div>
        </div>
    );
}

function HandbookCard({ item, query }) {
    return (
        <div className="handbook-search-card">
            {item.img && (
                <img className="handbook-search-card-img" src={item.img} alt={item.title} />
            )}
            <div className="handbook-search-card-info">
                <div className="handbook-search-card-title">{highlight(item.title, query)}</div>
                <div className="handbook-search-card-desc">{highlight(item.desc, query)}</div>
                <div className="handbook-search-card-type">Довідник</div>
            </div>
        </div>
    );
}

function OrbitCard({ item, query }) {
    return (
        <div className="orbit-search-card">
            {/* Без зображення */}
            <div className="orbit-search-card-info">
                <div className="orbit-search-card-title">{highlight(item.title, query)}</div>
                <div className="orbit-search-card-desc">{highlight(item.desc, query)}</div>
                <div className="orbit-search-card-type">Орбітальна станція</div>
            </div>
        </div>
    );
}

export default function SearchPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = useQueryParams();
    const query = queryParams.get("query") || "";
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    const { quizzes, loading: quizLoading } = useQuizzes();

    useEffect(() => {
        let active = true;
        async function searchData() {
            setLoading(true);
            let res = [];
            const lowerQuery = query.toLowerCase();
            const normQuery = normalize(query);

            try {
                const today = getTodayStr();
                const apod = await getApodByDate(today);
                if (
                    (apod.title && matchesQuery(apod.title, query)) ||
                    (apod.explanation && matchesQuery(apod.explanation, query))
                ) {
                    res.push({
                        type: "apod",
                        id: apod.date,
                        title: apod.title,
                        desc: apod.explanation,
                        date: apod.date,
                        img: apod.hdurl || apod.url,
                    });
                }
            } catch {}
            try {
                const favs = await getAllFavorites();
                res = res.concat(
                    favs.filter(
                        f =>
                            matchesQuery(f.title, query) ||
                            matchesQuery(f.explanation, query) ||
                            (f.date && f.date.includes(query))
                    ).map(f => ({
                        type: "journal",
                        id: f.id,
                        title: f.title,
                        desc: f.explanation,
                        date: f.date,
                        img: f.photoUrl,
                    }))
                );
            } catch {}

            try {
                const datesToSearch = getRecentDates(10);
                let found = false;
                for (const date of datesToSearch) {
                    for (let page = 1; page <= 2; page++) {
                        const marsPhotos = await getMarsPhotos({ date, page });
                        if (!marsPhotos.length) break;
                        const filtered = marsPhotos.filter(f => {
                            const photoTitle = `[${f.rover?.name}] ${f.camera?.full_name}`;
                            const photoTitleShort = `${f.rover?.name}: ${f.camera?.name}`;
                            const photoTitleVeryShort = `${f.rover?.name} ${f.camera?.name}`;
                            return (
                                matchesQuery(f.camera?.full_name, query) ||
                                matchesQuery(f.camera?.name, query) ||
                                matchesQuery(f.rover?.name, query) ||
                                matchesQuery(f.earth_date, query) ||
                                matchesQuery(photoTitle, query) ||
                                matchesQuery(photoTitleShort, query) ||
                                matchesQuery(photoTitleVeryShort, query) ||
                                normalize(photoTitle) === normQuery ||
                                normalize(photoTitleShort) === normQuery ||
                                normalize(photoTitleVeryShort) === normQuery
                            );
                        }).map(f => ({
                            type: "mars",
                            id: f.id,
                            title: `[${f.rover?.name}] ${f.camera?.full_name}`,
                            desc: f.earth_date,
                            date: f.earth_date,
                            img: f.img_src,
                        }));
                        if (filtered.length) {
                            res = res.concat(filtered);
                            found = true;
                        }
                        if (res.length > 50) break;
                    }
                    if (res.length > 50 || found) break;
                }
            } catch (e) {
                console.error(e);
            }

            if (!quizLoading) {
                res = res.concat(
                    quizzes
                        .flatMap(q =>
                            q.questions
                                .filter(
                                    qu =>
                                        matchesQuery(qu.question, query) ||
                                        matchesQuery(q.title, query)
                                )
                                .map(qu => ({
                                    type: "quiz",
                                    id: `${q.id}-${qu.id}`,
                                    title: q.title,
                                    desc: qu.question,
                                    date: "",
                                    img: qu.image || "",
                                }))
                        )
                );
            }
            res = res.concat(
                planetsData
                    .filter(
                        p =>
                            matchesQuery(p.name, query) ||
                            matchesQuery(p.overview?.content, query) ||
                            matchesQuery(p.structure?.content, query) ||
                            matchesQuery(p.geology?.content, query)
                    )
                    .map(p => ({
                        type: "handbook",
                        id: p.name,
                        title: p.name,
                        desc: p.overview?.content,
                        img: p.overview?.image,
                    }))
            );
            const issMatch = [
                issSearchEntry.name,
                issSearchEntry.desc,
                ...(issSearchEntry.keywords || [])
            ].some(str => matchesQuery(str, query));
            if (issMatch) {
                res.push({
                    type: "orbit",
                    id: issSearchEntry.id,
                    title: issSearchEntry.name,
                    desc: issSearchEntry.desc,
                    img: issSearchEntry.img,
                });
            }

            if (active) setResults(res);
            setLoading(false);
        }
        if (query.length >= 2) searchData();
        else {
            setResults([]);
            setLoading(false);
        }
        return () => { active = false; };
    }, [query, quizzes, quizLoading]);

    function handleBack() {
        navigate(-1);
    }

    return (
        <main className="search-results-root">
            <div className="search-results-header">
                <button className="search-results-backbtn" onClick={handleBack} title="Назад" aria-label="Назад">
                    <svg width="28" height="28" viewBox="0 0 28 28" style={{display: "block"}}>
                        <circle cx="14" cy="14" r="13" fill="#28284a" stroke="#b282fa" strokeWidth="1.5"/>
                        <polyline points="17,8 11,14 17,20" fill="none" stroke="#b282fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
                <h2>
                    <span className="search-results-prefix">Результати пошуку:</span>{" "}
                    <span className="search-results-query">{query}</span>
                </h2>
            </div>
            {loading ? (
                <div className="search-results-loading">Завантаження...</div>
            ) : results.length === 0 ? (
                <div className="search-results-empty">Нічого не знайдено.</div>
            ) : (
                <ul className="search-results-list">
                    {results.map(item =>
                        item.type === "apod" ? (
                            <li key={item.type + item.id} className="search-results-item-apod">
                                <ApodCard item={item} query={query} />
                            </li>
                        ) : item.type === "handbook" ? (
                            <li key={item.type + item.id} className="search-results-item-handbook">
                                <HandbookCard item={item} query={query} />
                            </li>
                        ) : item.type === "orbit" ? (
                            <li key={item.type + item.id} className="search-results-item-orbit">
                                <OrbitCard item={item} query={query} />
                            </li>
                        ) : (
                            <li key={item.type + item.id} className={`search-results-item search-${item.type}`}>
                                {item.img && (
                                    <img className="search-results-img" src={item.img} alt={item.title} />
                                )}
                                <div className="search-results-info">
                                    <div className="search-results-title">{highlight(item.title, query)}</div>
                                    <div className="search-results-desc">{highlight(item.desc, query)}</div>
                                    {item.date && <div className="search-results-date">{item.date}</div>}
                                    <div className="search-results-type">
                                        {item.type === "journal" && "Журнал"}
                                        {item.type === "mars" && "Марс"}
                                        {item.type === "quiz" && "Вікторина"}
                                    </div>
                                </div>
                            </li>
                        )
                    )}
                </ul>
            )}
        </main>
    );
}