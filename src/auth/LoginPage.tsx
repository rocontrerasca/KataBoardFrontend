import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { login } from "../api/authService";
import { centeredButton, errorStyle, formContainer, fullScreenContainer, inputStyle, labelStyle } from "../styles";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

const LoginPage = () => {
    const { setToken } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "admin@kataboard.com", password: "PasswordSegura123!" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});

    const isValidEmail = (email: string): boolean =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        setLoading(true);
        e.preventDefault();
        setError("");

        setValidationErrors({});

        const newErrors: { email?: string; password?: string } = {};
        if (!isValidEmail(form.email)) newErrors.email = "Correo inválido.";

        if (Object.keys(newErrors).length > 0) {
            setValidationErrors(newErrors);
             setLoading(false);
            return;
        }

        try {
            const res = await login(form);
            setToken(res.accessToken);
            toast.success("¡Bienvenido!");
            navigate("/projects");
        } catch {
            toast.error("Credenciales inválidas");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={fullScreenContainer}>
            <div style={formContainer}>
                <h2 style={{ textAlign: "center" }}>Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                    <label style={labelStyle}>Email:</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required style={inputStyle} />
                    {validationErrors.email && <p style={{ color: "red" }}>{validationErrors.email}</p>}

                    <label style={labelStyle}>Contraseña:</label>
                    <input name="password" type="password" value={form.password} onChange={handleChange} required style={inputStyle} />

                    {error && <p style={errorStyle}>{error}</p>}

                    <button type="submit" style={centeredButton}>Ingresar</button>
                </form>

                <p style={{ marginTop: "1rem", textAlign: "center" }}>
                    ¿No tienes cuenta? <a href="/register">Regístrate</a>
                </p>
            </div>
            {loading && <LoadingSpinner />}
        </div>
    );
};
export default LoginPage;
