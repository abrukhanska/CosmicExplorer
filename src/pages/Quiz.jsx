import React, { useState, useEffect } from "react";
import { useQuizzes } from "../components/useQuizzes";
import {
    saveQuizResult,
    getQuizResultsByQuiz,
    resetQuizResultsByQuiz,
    resetAllQuizResults,
} from "../api/quizResults";
import { Button, Form, Dropdown, Spinner } from "react-bootstrap";
import styles from "./Quiz.module.css";
import Toasts from "../components/Toasts";
import StarBgAnim from "../components/StarBgAnim";
import { FiArrowLeft } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const starsBgUrl = process.env.PUBLIC_URL + "/images/stars.svg";

function getResultBlock(results, score) {
    for (const res of results) {
        if (score >= res.min && score <= res.max) return res;
    }
    return results[0];
}

export default function Quiz() {
    const { quizzes, error: quizzesError, loading: quizzesLoading } = useQuizzes();
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [questionIdx, setQuestionIdx] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [showResult, setShowResult] = useState(false);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [quizResults, setQuizResults] = useState([]);
    const [justFinished, setJustFinished] = useState(false);
    const [toasts, setToasts] = useState([]);
    const [showFinalResult, setShowFinalResult] = useState(false);

    const { user } = useAuth();
    const userEmail = user?.email || "";
    const isRegistered = !!userEmail;

    useEffect(() => {
        if (quizzes && quizzes.length > 0 && !selectedQuiz) {
            setSelectedQuiz(quizzes[0]);
        }
    }, [quizzes, selectedQuiz]);

    useEffect(() => {
        if (isRegistered && selectedQuiz) {
            setLoading(true);
            getQuizResultsByQuiz(userEmail, selectedQuiz.id)
                .then(setQuizResults)
                .catch(() => setQuizResults([]))
                .finally(() => setLoading(false));
        } else {
            setQuizResults([]);
        }
    }, [userEmail, selectedQuiz, isRegistered]);

    function showToast(text, variant = "info") {
        setToasts(ts => [...ts, { text, variant }]);
    }
    const handleQuizChange = (quizId) => {
        const quiz = quizzes.find((q) => q.id === quizId);
        setSelectedQuiz(quiz);
        setQuestionIdx(0);
        setUserAnswers({});
        setShowResult(false);
        setResult(null);
        setShowFinalResult(false);
        setJustFinished(false);
    };
    const handleGoBack = () => {
        setShowFinalResult(false);
        setShowResult(false);
        setResult(null);
        setJustFinished(false);
        setQuestionIdx(0);
        setUserAnswers({});
    };

    const quizRootBgStyle = {
        background: `radial-gradient(ellipse at 60% 5%, #3e2c5a 0%, #21213d 60%, #100e1a 100%), url(${starsBgUrl}) repeat top center`,
        backgroundBlendMode: "lighten",
        animation: "starMove 120s linear infinite alternate"
    };

    if (quizzesLoading)
        return (
            <div className={styles.loaderCenter}>
                <Spinner /> Завантаження вікторин...
                <StarBgAnim />
            </div>
        );
    if (quizzesError) {
        return (
            <>
                <div className={styles.loaderCenter}>
                    <span className={styles.textDanger}>{quizzesError}</span>
                </div>
                <Toasts messages={toasts.concat([{ text: quizzesError, variant: "danger" }])} onClose={idx => setToasts(ts => ts.filter((_, i) => i !== idx))} />
                <StarBgAnim />
            </>
        );
    }
    if (!quizzes) return <StarBgAnim />;
    if (quizzes.length === 0)
        return <div className={styles.loaderCenter}>Вікторин не знайдено<StarBgAnim /></div>;
    if (!selectedQuiz) return <StarBgAnim />;

    const currQ = selectedQuiz.questions[questionIdx];

    return (
        <div className={styles.quizRoot} style={quizRootBgStyle}>
            <StarBgAnim />
            <h2 className={styles.gradientText}>Космічні вікторини</h2>
            <div className={styles.quizDropdownRow}>
                <Dropdown>
                    <Dropdown.Toggle variant="primary" id="dropdown-basic" className={styles.dropdownToggle}>
                        {selectedQuiz.title}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {quizzes.map((q) => (
                            <Dropdown.Item
                                key={q.id}
                                onClick={() => handleQuizChange(q.id)}
                                active={q.id === selectedQuiz.id}
                            >
                                {q.title}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            {isRegistered && (
                <div className={styles.quizActionsRow}>
                    <Button
                        variant="outline-danger"
                        size="sm"
                        className={styles.quizBtn}
                        onClick={async () => {
                            setLoading(true);
                            await resetQuizResultsByQuiz(userEmail, selectedQuiz.id);
                            setQuizResults([]);
                            setLoading(false);
                            showToast("Результати цієї вікторини очищено!", "success");
                        }}
                        disabled={loading}
                    >
                        Очистити результати цієї вікторини
                    </Button>
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        className={styles.quizBtn}
                        onClick={async () => {
                            setLoading(true);
                            await resetAllQuizResults(userEmail);
                            setQuizResults([]);
                            setLoading(false);
                            showToast("Всі результати очищено!", "success");
                        }}
                        disabled={loading}
                    >
                        Скинути всі результати
                    </Button>
                </div>
            )}
            <div className={styles.quizResults}>
                <strong>Історія спроб:</strong>
                {isRegistered ? (
                    <ul className={styles.quizResultsList}>
                        {quizResults.length === 0 ? (
                            <li className={styles.quizResultsEmpty}>Немає спроб</li>
                        ) : (
                            quizResults
                                .slice()
                                .reverse()
                                .map((res) => (
                                    <li key={res.id}>
                                        {new Date(res.date).toLocaleString("uk-UA")} —{" "}
                                        <span className={styles.quizResultsScore}>
                                            {res.score}/{res.total}
                                        </span>
                                    </li>
                                ))
                        )}
                    </ul>
                ) : (
                    <div className={styles.quizResultsEmpty}>
                        <i>
                            Історія спроб та збереження результатів доступні лише для зареєстрованих користувачів.
                        </i>
                    </div>
                )}
            </div>
            <div className={styles.flexQuizCard}>
                {!showFinalResult ? (
                    <div className={styles.quizCard}>
                        {currQ.image && (
                            <div className={styles.quizImageWrap}>
                                <img
                                    src={process.env.PUBLIC_URL + "/" + currQ.image}
                                    alt="question visual"
                                />
                            </div>
                        )}
                        <div className={styles.quizCardContent}>
                            <div className={styles.cardTitleQuestion}>
                                Питання {questionIdx + 1} із {selectedQuiz.questions.length}
                            </div>
                            <div className={styles.cardTextQuestion}>{currQ.question}</div>
                            <Form>
                                {currQ.type === "radio" ? (
                                    currQ.options.map((opt, idx) => (
                                        <Form.Check
                                            key={idx}
                                            type="radio"
                                            name={`q${currQ.id}`}
                                            id={`q${currQ.id}_opt${idx}`}
                                            label={opt}
                                            checked={userAnswers[currQ.id] == idx}
                                            onChange={() => setUserAnswers({ ...userAnswers, [currQ.id]: idx })}
                                            disabled={showResult}
                                            className={
                                                showResult
                                                    ? idx === currQ.answer
                                                        ? styles.correct
                                                        : userAnswers[currQ.id] == idx
                                                            ? styles.incorrect
                                                            : ""
                                                    : ""
                                            }
                                        />
                                    ))
                                ) : (
                                    <Form.Select
                                        value={userAnswers[currQ.id] ?? ""}
                                        onChange={(e) => setUserAnswers({ ...userAnswers, [currQ.id]: Number(e.target.value) })}
                                        disabled={showResult}
                                        className={
                                            showResult
                                                ? userAnswers[currQ.id] == currQ.answer
                                                    ? styles.correct
                                                    : styles.incorrect
                                                : ""
                                        }
                                    >
                                        <option value="">Оберіть відповідь</option>
                                        {currQ.options.map((opt, idx) => (
                                            <option key={idx} value={idx}>
                                                {opt}
                                            </option>
                                        ))}
                                    </Form.Select>
                                )}
                            </Form>
                            {showResult && (
                                <div className={styles.quizResultMsg}>
                                    {userAnswers[currQ.id] == currQ.answer ? (
                                        <span className={styles.resultRight}>Вірно!</span>
                                    ) : (
                                        <span className={styles.resultWrong}>
                                            Неправильно. Правильна відповідь:{" "}
                                            <b>{currQ.options[currQ.answer]}</b>
                                        </span>
                                    )}
                                </div>
                            )}
                            <div className={styles.quizBtnsRow}>
                                {!showResult ? (
                                    <Button
                                        className={styles.quizBtn}
                                        onClick={() => {
                                            if (
                                                userAnswers[currQ.id] === undefined ||
                                                userAnswers[currQ.id] === ""
                                            ) {
                                                showToast("Оберіть варіант відповіді!", "danger");
                                                return;
                                            }
                                            setShowResult(true);
                                        }}
                                    >
                                        Відповісти
                                    </Button>
                                ) : (
                                    <Button
                                        className={styles.quizBtn}
                                        onClick={async () => {
                                            setShowResult(false);
                                            if (questionIdx + 1 < selectedQuiz.questions.length) {
                                                setQuestionIdx(questionIdx + 1);
                                            } else {
                                                const correct = selectedQuiz.questions.filter(
                                                    (q) => userAnswers[q.id] == q.answer
                                                ).length;
                                                setResult({ score: correct, total: selectedQuiz.questions.length });
                                                setJustFinished(true);
                                                setShowFinalResult(true);
                                                if (isRegistered) {
                                                    try {
                                                        await saveQuizResult({
                                                            userEmail,
                                                            score: correct,
                                                            total: selectedQuiz.questions.length,
                                                            quizId: selectedQuiz.id,
                                                        });
                                                        showToast("Результат збережено!", "success");
                                                    } catch (e) {
                                                        showToast(e.message, "danger");
                                                    }
                                                }
                                            }
                                        }}
                                    >
                                        {questionIdx + 1 < selectedQuiz.questions.length
                                            ? "Наступне питання"
                                            : "Завершити"}
                                    </Button>
                                )}
                            </div>
                            {!isRegistered && (
                                <div className={styles.quizDemoMsg}>
                                    <div>
                                        <b>Увага:</b> Ви проходите вікторину в демо-режимі.<br />
                                        Щоб зберігати результати і переглядати свою історію, <span className={styles.quizLink}>увійдіть або зареєструйтесь</span>.
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <ResultBlock
                        result={result}
                        quiz={selectedQuiz}
                        onShare={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: "Мій результат вікторини на Cosmic Explorer",
                                    text: `Я пройшов(ла) "${selectedQuiz.title}" на ${result.score} з ${result.total}!`,
                                    url: window.location.href,
                                });
                            } else {
                                navigator.clipboard.writeText(
                                    `Я пройшов(ла) "${selectedQuiz.title}" на ${result.score} з ${result.total}!`
                                );
                                showToast("Результат скопійовано в буфер обміну!", "info");
                            }
                        }}
                        isRegistered={isRegistered}
                        justFinished={justFinished}
                        onBack={handleGoBack}
                    />
                )}
            </div>
            {loading && (
                <div className={styles.loaderCenter}>
                    <Spinner animation="border" />
                </div>
            )}
            <Toasts messages={toasts} onClose={idx => setToasts(ts => ts.filter((_, i) => i !== idx))} />
        </div>
    );
}

function ResultBlock({ result, quiz, onShare, isRegistered, justFinished, onBack }) {
    const feedback = getResultBlock(quiz.results, result.score);
    return (
        <div className={styles.resultBlock}>
            <button className={styles.backBtn} onClick={onBack}>
                <FiArrowLeft /> Назад
            </button>
            <div className={styles.resultBlockTitle}>
                {quiz.title}
            </div>
            <h3 className={styles.resultHeading}>
                Ваш результат:{" "}
                <span className={styles.resultScore}>
                    {result.score} / {result.total}
                </span>
            </h3>
            <div className={styles.resultFeedback}>
                <img
                    src={process.env.PUBLIC_URL + "/" + feedback.image}
                    alt="feedback"
                    className={styles.resultImage}
                />
                <p className={styles.resultText}>{feedback.text}</p>
            </div>
            {!isRegistered && justFinished && (
                <div className={styles.resultNotSaved}>
                    <b>Результат не збережено.</b><br />
                    Щоб зберігати результати та переглядати історію проходжень, будь ласка, <span className={styles.quizLink}>увійдіть або зареєструйтесь</span>.
                </div>
            )}
            <div className={styles.resultBtnsRow}>
                <Button variant="info" className={styles.quizBtn} onClick={onShare}>
                    Поділитися результатом
                </Button>
                <Button
                    variant="secondary"
                    className={styles.quizBtn}
                    onClick={() => window.location.reload()}
                >
                    Почати ще раз
                </Button>
            </div>
        </div>
    );
}