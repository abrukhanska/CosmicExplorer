import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./ISS.css";
import ISSMarker from "../components/ISSMarker";
import { getISSData } from "../api/ISSapi";

const TAIL_LENGTH = 60;

function ISSPath({ position, path }) {
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.setView(position, map.getZoom(), { animate: true });
        }
    }, [position, map]);

    return (
        <>
            {path.length > 1 && (
                <Polyline
                    positions={path}
                    color="#00eaff"
                    weight={3}
                    opacity={0.7}
                    lineCap="round"
                    lineJoin="round"
                />
            )}
            <ISSMarker position={position} />
        </>
    );
}

const ISS = () => {
    const [issData, setIssData] = useState(null);
    const [tail, setTail] = useState([]);
    const [error, setError] = useState(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            try {
                const data = await getISSData();
                if (!data) throw new Error("Не вдалося отримати дані про МКС.");
                if (isMounted) {
                    setIssData(data);
                    setTail(prevTail =>
                        [...prevTail, [data.latitude, data.longitude]].slice(-TAIL_LENGTH)
                    );
                    setError(null);
                }
            } catch (err) {
                if (isMounted) setError("Не вдалося завантажити дані. Спробуйте пізніше.");
            }
        }

        fetchData();
        intervalRef.current = setInterval(fetchData, 5000);

        return () => {
            isMounted = false;
            clearInterval(intervalRef.current);
        };
    }, []);

    return (
        <div className="iss-tracker__container">
            <main className="iss-tracker__map">
                <div style={{ position: "relative", height: "100%", width: "100%" }}>
                    <MapContainer
                        center={issData ? [issData.latitude, issData.longitude] : [0, 0]}
                        zoom={3}
                        minZoom={2}
                        maxZoom={6}
                        style={{ height: "100%", width: "100%" }}
                        zoomControl={false}
                        attributionControl={false}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; <a href='https://openstreetmap.org'>OpenStreetMap</a> contributors"
                        />
                        {issData && (
                            <ISSPath
                                position={[issData.latitude, issData.longitude]}
                                path={tail}
                            />
                        )}
                        {/* Напівтемний overlay всередині MapContainer, ПІСЛЯ TileLayer, але ПЕРЕД ISSPath */}
                        <div className="iss-dark-overlay" />
                    </MapContainer>
                </div>
            </main>
            <aside className="iss-tracker__sidebar">
                <h2 className="iss-tracker__title">Орбітальна станція</h2>
                {error && (
                    <div className="iss-tracker__error">{error}</div>
                )}
                {!error && !issData && (
                    <div className="iss-tracker__loading">Завантаження інформації…</div>
                )}
                {!error && issData && (
                    <ul className="iss-tracker__list">
                        <li>
                            <span>Широта:</span>
                            <strong>{issData.latitude.toFixed(2)}</strong>
                        </li>
                        <li>
                            <span>Довгота:</span>
                            <strong>{issData.longitude.toFixed(2)}</strong>
                        </li>
                        <li>
                            <span>Висота:</span>
                            <strong>{Math.round(issData.altitude)} км</strong>
                        </li>
                        <li>
                            <span>Швидкість:</span>
                            <strong>{Math.round(issData.velocity).toLocaleString()} км/год</strong>
                        </li>
                        <li className="iss-tracker__timestamp">
                            Останнє оновлення:{" "}
                            {new Date(issData.timestamp * 1000).toLocaleTimeString("uk-UA")}
                        </li>
                    </ul>
                )}
            </aside>
        </div>
    );
};

export default ISS;