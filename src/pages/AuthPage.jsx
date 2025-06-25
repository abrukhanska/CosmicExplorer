import React, { useState, useContext, useEffect } from "react";
import { Card, Button, Form, Alert, Spinner, Container } from "react-bootstrap";
import "./AuthPage.css";
import { registerUser, loginUser, checkEmailUnique } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ExoPlanetIcon = ({ animate }) => (
    <svg
        width="88"
        height="88"
        viewBox="0 0 88 88"
        fill="none"
        className={"exoplanet-planet" + (animate ? " planet-anim" : "")}
        style={{ display: "block" }}
    >
        <defs>
            <radialGradient id="exoBodyAnim" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffd86c">
                    <animate attributeName="stop-color" values="#ffd86c;#fa5cff;#20e3b2;#ffd86c" dur="8s" repeatCount="indefinite"/>
                </stop>
                <stop offset="100%" stopColor="#423fff">
                    <animate attributeName="stop-color" values="#423fff;#7a5af8;#20e3b2;#423fff" dur="8s" repeatCount="indefinite"/>
                </stop>
            </radialGradient>
            <linearGradient id="exoRingAnim" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fa5cff">
                    <animate attributeName="stop-color" values="#fa5cff;#20e3b2;#fa5cff" dur="7s" repeatCount="indefinite"/>
                </stop>
                <stop offset="100%" stopColor="#20e3b2">
                    <animate attributeName="stop-color" values="#20e3b2;#ffd86c;#20e3b2" dur="7s" repeatCount="indefinite"/>
                </stop>
            </linearGradient>
            <linearGradient id="exoCloudAnim" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fff" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0.2">
                    <animate attributeName="stop-opacity" values="0.2;0.6;0.2" dur="7s" repeatCount="indefinite"/>
                </stop>
            </linearGradient>
            <radialGradient id="exoLavaAnim" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffb347">
                    <animate attributeName="stop-color" values="#ffb347;#fa5cff;#ffb347" dur="5s" repeatCount="indefinite"/>
                </stop>
                <stop offset="100%" stopColor="#fa5cff"/>
            </radialGradient>
        </defs>
        <ellipse cx="44" cy="54" rx="30" ry="8.5" fill="url(#exoRingAnim)" opacity="0.48"/>
        <circle cx="44" cy="44" r="32" fill="url(#exoBodyAnim)" />
        <ellipse cx="44" cy="62" rx="15" ry="5.5" fill="url(#exoLavaAnim)" opacity="0.23"/>
        <ellipse cx="58" cy="37" rx="9" ry="2.2" fill="url(#exoCloudAnim)" opacity="0.38">
            <animate attributeName="cx" values="58;60;55;58" dur="7s" repeatCount="indefinite"/>
        </ellipse>
        <ellipse cx="32" cy="56" rx="12" ry="2.5" fill="url(#exoCloudAnim)" opacity="0.11">
            <animate attributeName="cx" values="32;38;30;32" dur="9s" repeatCount="indefinite"/>
        </ellipse>
        <path d="M22 53 Q44 65 66 51" stroke="url(#exoRingAnim)" strokeWidth="3" fill="none" opacity="0.22">
            <animate attributeName="d" values="
        M22 53 Q44 65 66 51;
        M26 56 Q44 68 62 52;
        M22 53 Q44 65 66 51
      " dur="8s" repeatCount="indefinite"/>
        </path>
    </svg>
);

function validateEmail(email) {
    if (!email) return "Email обов'язковий";
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        return "Некоректний email. Використовуйте лише латиницю, цифри та стандартні символи.";
    }
    return "";
}

function getPasswordErrors(password) {
    const errors = [];
    if (!password) errors.push("Пароль обов'язковий");
    if (password.length < 8) errors.push("Мінімум 8 символів");
    if (!/[A-Z]/.test(password)) errors.push("Хоч одна велика літера");
    if (!/[a-z]/.test(password)) errors.push("Хоч одна мала літера");
    if (!/\d/.test(password)) errors.push("Хоч одна цифра");
    return errors;
}

export default function AuthPage() {
    const [mode, setMode] = useState("signin");
    const [prevMode, setPrevMode] = useState("signin");
    const [modeTransition, setModeTransition] = useState("");
    const [iconAnim, setIconAnim] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState({});
    const [showAlert, setShowAlert] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    useEffect(() => {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, []);

    useEffect(() => {
        if (mode !== prevMode) {
            setModeTransition(mode === "signin" ? "fade-in-left" : "fade-in-right");
            setIconAnim(true);
            const timeout = setTimeout(() => {
                setModeTransition("");
                setPrevMode(mode);
                setIconAnim(false);
            }, 570);
            return () => clearTimeout(timeout);
        }
    }, [mode, prevMode]);

    const clearForm = () => {
        setEmail("");
        setPassword("");
        setRepeatPassword("");
        setError("");
        setSuccess("");
        setTouched({});
        setShowAlert(false);
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setShowAlert(false);
        setTouched({ email: true, password: true });
        if (!email || !password) {
            setError("Всі поля обов'язкові!");
            setShowAlert(true);
            return;
        }
        if (validateEmail(email)) {
            setError(validateEmail(email));
            setShowAlert(true);
            return;
        }
        setLoading(true);
        try {
            const user = await loginUser(email, password);
            login(user);
            setSuccess("Вхід успішний!");
            setShowAlert(false);
            setTimeout(() => navigate("/"), 1200);
        } catch {
            setError("Невірний email або пароль.");
            setShowAlert(true);
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setShowAlert(false);
        setTouched({ email: true, password: true, repeatPassword: true });
        if (!email || !password || !repeatPassword) {
            setError("Всі поля обов'язкові!");
            setShowAlert(true);
            return;
        }
        if (validateEmail(email)) {
            setError(validateEmail(email));
            setShowAlert(true);
            return;
        }
        const passwordErrors = getPasswordErrors(password);
        if (passwordErrors.length > 0) {
            setError(passwordErrors.join(" "));
            setShowAlert(true);
            return;
        }
        if (password !== repeatPassword) {
            setError("Паролі не співпадають!");
            setShowAlert(true);
            return;
        }
        setLoading(true);
        try {
            const isUnique = await checkEmailUnique(email);
            if (!isUnique) {
                setError("Такий email вже зареєстровано.");
                setShowAlert(true);
                setLoading(false);
                return;
            }
            await registerUser(email, password);
            setSuccess("Реєстрація успішна! Можна увійти.");
            setShowAlert(false);
            setTimeout(() => {
                setMode("signin");
                clearForm();
            }, 1400);
        } catch {
            setError("Сталася помилка при реєстрації.");
            setShowAlert(true);
        } finally {
            setLoading(false);
        }
    };

    function PasswordChecklist({ password, show }) {
        const checks = [
            {text: "Мінімум 8 символів",    valid: password.length >= 8},
            {text: "Хоч одна велика латинська літера", valid: /[A-Z]/.test(password)},
            {text: "Хоч одна мала  літера",   valid: /[a-z]/.test(password)},
            {text: "Хоч одна цифра",         valid: /\d/.test(password)},
        ];
        if (!show) return null;
        return (
            <ul className="list-unstyled mb-2 ps-1 small password-checklist">
                {checks.map((c, i) => (
                    <li key={i} style={{ color: c.valid ? "#20e3b2" : "#e254ff", display: "flex", alignItems: "center", gap: 4, transition: "color 0.2s" }}>
                        <span>{c.valid ? "✔️" : "❌"}</span>
                        {c.text}
                    </li>
                ))}
            </ul>
        );
    }

    const panelTexts = {
        signin: {
            title: "Вітаємо у Космічному Щоденнику!",
            text: "Відкрийте свій космічний профіль, щоб знову мандрувати Галактикою відкриттів.",
            button: "Зареєструватись"
        },
        signup: {
            title: "Створи власний Всесвіт!",
            text: "Зареєструйся та розпочни збирати улюблені космічні знімки та відкривати Всесвіт разом із нами.",
            button: "Увійти"
        }
    };

    return (
        <div className="auth-bg-perfect">
            <Container fluid className="p-0">
                <div className="auth-perfect-centered">
                    <div className="auth-perfect-content">
                        <div className="auth-panel">
                            <div className="auth-panel-icon">
                                <ExoPlanetIcon animate={iconAnim}/>
                            </div>
                            <h2>{mode === "signin" ? panelTexts.signin.title : panelTexts.signup.title}</h2>
                            <p>{mode === "signin" ? panelTexts.signin.text : panelTexts.signup.text}</p>
                            <button
                                onClick={() => {
                                    setMode(mode === "signin" ? "signup" : "signin");
                                    clearForm();
                                }}
                                className="cosmic-btn"
                                type="button"
                            >
                                {mode === "signin" ? panelTexts.signin.button : panelTexts.signup.button}
                            </button>
                        </div>
                        <Card className="auth-card">
                            <Card.Body className={`p-0 auth-form-anim ${modeTransition}`}>
                                {showAlert && error && (
                                    <Alert
                                        variant="danger"
                                        dismissible
                                        onClose={() => setShowAlert(false)}
                                        className="mb-4"
                                    >
                                        {error}
                                    </Alert>
                                )}
                                {success && (
                                    <Alert
                                        variant="success"
                                        dismissible
                                        onClose={() => setSuccess("")}
                                        className="mb-4"
                                    >
                                        {success}
                                    </Alert>
                                )}
                                {mode === "signin" ? (
                                    <>
                                        <h2 className="mb-2 text-center fw-bold">Вхід</h2>
                                        <p className="text-muted text-center mb-4">
                                            Введіть email і пароль, щоб увійти до свого щоденника.
                                        </p>
                                        <Form onSubmit={handleSignIn} autoComplete="off" noValidate>
                                            <Form.Group className="mb-3" controlId="loginEmail">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    value={email}
                                                    onChange={e => {
                                                        setEmail(e.target.value);
                                                        setTouched(t => ({ ...t, email: true }));
                                                    }}
                                                    placeholder="name@example.com"
                                                    autoComplete="username"
                                                    required
                                                    isInvalid={touched.email && !!validateEmail(email)}
                                                    isValid={touched.email && !validateEmail(email)}
                                                    onBlur={() => setTouched(t => ({ ...t, email: true }))}
                                                />
                                                {touched.email && validateEmail(email) && (
                                                    <div className="form-error-msg">{validateEmail(email)}</div>
                                                )}
                                            </Form.Group>
                                            <Form.Group className="mb-4" controlId="loginPassword">
                                                <Form.Label>Пароль</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    value={password}
                                                    onChange={e => {
                                                        setPassword(e.target.value);
                                                        setTouched(t => ({ ...t, password: true }));
                                                    }}
                                                    placeholder="Введіть пароль"
                                                    autoComplete="current-password"
                                                    required
                                                />
                                                <Form.Text className="text-muted">
                                                    Введіть свій пароль. Якщо пароль неправильний — ви побачите підказку зверху.
                                                </Form.Text>
                                            </Form.Group>
                                            <Button
                                                className="w-100 mb-3 cosmic-btn"
                                                variant="info"
                                                type="submit"
                                                disabled={loading || !!validateEmail(email) || !password}
                                            >
                                                {loading
                                                    ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                                    : "Увійти"}
                                            </Button>
                                        </Form>
                                    </>
                                ) : (
                                    <>
                                        <h2 className="mb-2 text-center fw-bold">Реєстрація</h2>
                                        <p className="text-muted text-center mb-4">
                                            Створи свій космічний профіль, щоб зберігати знімки Всесвіту!
                                        </p>
                                        <Form onSubmit={handleSignUp} autoComplete="off" noValidate>
                                            <Form.Group className="mb-3" controlId="registerEmail">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    value={email}
                                                    onChange={e => {
                                                        setEmail(e.target.value);
                                                        setTouched(t => ({ ...t, email: true }));
                                                    }}
                                                    placeholder="name@example.com"
                                                    autoComplete="username"
                                                    required
                                                    isInvalid={touched.email && !!validateEmail(email)}
                                                    isValid={touched.email && !validateEmail(email)}
                                                    onBlur={() => setTouched(t => ({ ...t, email: true }))}
                                                />
                                                {touched.email && validateEmail(email) && (
                                                    <div className="form-error-msg">{validateEmail(email)}</div>
                                                )}
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="registerPassword">
                                                <Form.Label>Пароль</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    value={password}
                                                    onChange={e => {
                                                        setPassword(e.target.value);
                                                        setTouched(t => ({ ...t, password: true }));
                                                    }}
                                                    placeholder="Створіть пароль"
                                                    autoComplete="new-password"
                                                    required
                                                    isInvalid={touched.password && getPasswordErrors(password).length > 0}
                                                    isValid={touched.password && getPasswordErrors(password).length === 0}
                                                    onBlur={() => setTouched(t => ({ ...t, password: true }))}
                                                />
                                                <PasswordChecklist password={password} show={!!touched.password && password.length > 0} />
                                                {touched.password && getPasswordErrors(password).length > 0 && (
                                                    <div className="form-error-msg">
                                                        {getPasswordErrors(password).map((e, i) => (
                                                            <div key={i}>{e}</div>
                                                        ))}
                                                    </div>
                                                )}
                                            </Form.Group>
                                            <Form.Group className="mb-4" controlId="registerRepeatPassword">
                                                <Form.Label>Повторіть пароль</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    value={repeatPassword}
                                                    onChange={e => {
                                                        setRepeatPassword(e.target.value);
                                                        setTouched(t => ({ ...t, repeatPassword: true }));
                                                    }}
                                                    placeholder="Повторіть пароль"
                                                    autoComplete="new-password"
                                                    required
                                                    isInvalid={touched.repeatPassword && password !== repeatPassword}
                                                    isValid={touched.repeatPassword && password === repeatPassword && repeatPassword.length > 0}
                                                    onBlur={() => setTouched(t => ({ ...t, repeatPassword: true }))}
                                                />
                                                {touched.repeatPassword && password !== repeatPassword && (
                                                    <div className="form-error-msg">Паролі не співпадають!</div>
                                                )}
                                            </Form.Group>
                                            <Button
                                                className="w-100 mb-3 cosmic-btn"
                                                variant="info"
                                                type="submit"
                                                disabled={
                                                    loading ||
                                                    !!validateEmail(email) ||
                                                    getPasswordErrors(password).length > 0 ||
                                                    repeatPassword !== password
                                                }
                                            >
                                                {loading
                                                    ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                                    : "Зареєструватись"}
                                            </Button>
                                        </Form>
                                    </>
                                )}
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </Container>
        </div>
    );
}