import { useEffect, useState } from "react";

export function useQuizzes() {
    const [quizzes, setQuizzes] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`${process.env.PUBLIC_URL}/quizzes.json`)
            .then((res) => {
                if (!res.ok) throw new Error("Не вдалося завантажити вікторини.");
                return res.json();
            })
            .then(setQuizzes)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    return { quizzes, error, loading };
}