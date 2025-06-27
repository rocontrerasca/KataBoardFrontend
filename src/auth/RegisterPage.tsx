import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/authService";
import { centeredButton, errorStyle, formContainer, fullScreenContainer, inputStyle, labelStyle, successStyle } from "../styles";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";



const RegisterPage = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});

    const isValidEmail = (email: string): boolean =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const isStrongPassword = (password: string): boolean =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        setLoading(true);
        e.preventDefault();
        setError("");
        setSuccess("");

        setValidationErrors({});

        const newErrors: { email?: string; password?: string } = {};
        if (!isValidEmail(form.email)) newErrors.email = "Correo inválido.";
        if (!isStrongPassword(form.password)) newErrors.password = "Contraseña no cumple con los requisitos minimos.";

        if (Object.keys(newErrors).length > 0) {
            setValidationErrors(newErrors);
             setLoading(false);
            return;
        }

        try {
            await register(form);
            toast.success("Registro exitoso. Ahora puedes iniciar sesión.");
            setTimeout(() => navigate("/login"), 2000);
        } catch {
            toast.error("Error al registrar usuario.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={fullScreenContainer}>
            <div style={formContainer}>
                <h2 style={{ textAlign: "center" }}>Registro de Usuario</h2>
                <form onSubmit={handleSubmit}>
                    <label style={labelStyle}>Nombre:</label>
                    <input name="firstName" value={form.firstName} onChange={handleChange} required style={inputStyle} />

                    <label style={labelStyle}>Apellido:</label>
                    <input name="lastName" value={form.lastName} onChange={handleChange} required style={inputStyle} />

                    <label style={labelStyle}>Email:</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required style={inputStyle} />
                    {validationErrors.email && <p style={{ color: "red" }}>{validationErrors.email}</p>}

                    <label style={labelStyle}>Contraseña:</label>
                    <input name="password" type="password" value={form.password} onChange={handleChange} required style={inputStyle} />
                    {validationErrors.password && <p style={{ color: "red" }}>{validationErrors.password}</p>}

                    {error && <p style={errorStyle}>{error}</p>}
                    {success && <p style={successStyle}>{success}</p>}

                    <button type="submit" style={centeredButton}>Registrar</button>
                </form>

                <p style={{ marginTop: "1rem", textAlign: "center" }}>
                    ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
                </p>
            </div>
            {loading && <LoadingSpinner />}
        </div>
    );
};

export default RegisterPage;
