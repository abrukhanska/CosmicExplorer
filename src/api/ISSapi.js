// API: https://wheretheiss.at/w/developer

export async function getISSData() {
    try {
        const response = await fetch("https://api.wheretheiss.at/v1/satellites/25544");
        if (!response.ok) return null;
        const data = await response.json();
        return {
            latitude: data.latitude,
            longitude: data.longitude,
            altitude: data.altitude,     // Висота, км
            velocity: data.velocity,     // Швидкість, км/год
            timestamp: data.timestamp,   // UNIX time (секунди)
        };
    } catch {
        return null;
    }
}