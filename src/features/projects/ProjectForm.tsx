import { toast } from "react-toastify";
import { createProject, getUsers } from "../../api/projectService";
import { centeredButton, fullScreenContainer } from "../../styles";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type ProjectFormProps = {
    initialData?: {
        name: string;
        description: string;
        status: string;
        collaborators: string[];
    };
    onSubmit?: (formData: {
        name: string;
        description: string;
        status: string;
        collaborators: string[];
    }) => Promise<void>;
};

const styles = {
    container: {
        maxWidth: "500px",
        margin: "auto",
        background: "#fff",
        padding: "2rem",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },
    form: {
        display: "flex",
        flexDirection: "column" as const,
        gap: "1rem",
    },
    input: {
        padding: "0.5rem",
        borderRadius: "4px",
        border: "1px solid #ccc",
        fontSize: "1rem",
        width: "100%",
        boxSizing: "border-box" as const,
    },
    collabList: {
        display: "flex",
        flexDirection: "column" as const,
        gap: "0.5rem",
        marginTop: "0.5rem",
    },
    checkboxLabel: {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        fontWeight: 400,
    },
};

export const ProjectForm: React.FC<ProjectFormProps> = ({ initialData, onSubmit }) => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        description: "",
        status: "ACTIVO",
        collaborators: [] as string[],
    });

    const [allUsers, setAllUsers] = useState<string[]>([]);

    useEffect(() => {
        if (initialData) {
            setForm(initialData);
        }
    }, [initialData]);

    useEffect(() => {
        getUsers()
            .then(setAllUsers)
            .catch(() => toast.error("Error al cargar usuarios"));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCollaboratorToggle = (email: string) => {
        setForm((prev) => ({
            ...prev,
            collaborators: prev.collaborators.includes(email)
                ? prev.collaborators.filter((e) => e !== email)
                : [...prev.collaborators, email],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (onSubmit) {
                await onSubmit(form);
            } else {
                await createProject(form);
                toast.success("Proyecto creado");
                navigate("/projects");
            }
        } catch {
            toast.error("Error al guardar el proyecto");
        }
    };

    return (
        <div style={fullScreenContainer}>
            <div style={styles.container}>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <h2>{initialData ? "Editar Proyecto" : "Crear Proyecto"}</h2>

                    <input
                        type="text"
                        name="name"
                        placeholder="Nombre del proyecto"
                        value={form.name}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />

                    <textarea
                        name="description"
                        placeholder="Descripción"
                        value={form.description}
                        onChange={handleChange}
                        style={styles.input}
                    />

                    <select name="status" value={form.status} onChange={handleChange} style={styles.input}>
                        <option value="NUEVO">Nuevo</option>
                        <option value="ACTIVO">Activo</option>
                        <option value="CERRADO">Cerrado</option>
                    </select>

                    <div style={{ marginBottom: "1rem", textAlign: "left" }}>
                        <label style={{ fontWeight: "bold" }}>Colaboradores:</label>
                        <div style={styles.collabList}>
                            {allUsers.map((email) => (
                                <label key={email} style={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={form.collaborators.includes(email)}
                                        onChange={() => handleCollaboratorToggle(email)}
                                    />
                                    {email}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                        <button type="submit" style={centeredButton}>
                            {initialData ? "Guardar Cambios" : "Crear"}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/projects")}
                            style={{ ...centeredButton, backgroundColor: "#6c757d" }}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
