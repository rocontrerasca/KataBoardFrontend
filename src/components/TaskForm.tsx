import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllUsers } from "../api/projectService";
import { createTask, getTaskById, updateTask } from "../api/taskService";
import { fullScreenContainer } from "../styles";
import { getTags } from "../api/tagService";

export const TaskForm = () => {
    const { id, taskId } = useParams(); // id = projectId, taskId opcional
    const navigate = useNavigate();

    interface TagResponse {
        id: number;
        name: string;
        color: string;
    }

    const [form, setForm] = useState({
        title: "",
        description: "",
        estimatedHours: "",
        status: "TODO",
        assignedToEmail: "",
        tagIds: [] as number[],
    });

    const [users, setUsers] = useState<any[]>([]);
    const [tags, setTags] = useState<TagResponse[]>([]);

    const isEdit = !!taskId;

    useEffect(() => {
        getAllUsers().then(setUsers).catch(() => toast.error("Error al cargar usuarios"));
        getTags().then(setTags).catch(() => toast.error("Error al cargar tags"));

        if (isEdit) {
            getTaskById(Number(taskId))
                .then((task) => {
                    setForm({
                        title: task.title,
                        description: task.description,
                        estimatedHours: task.estimatedHours.toString(),
                        status: task.status,
                        assignedToEmail: task.assignedToEmail,
                        tagIds: Array.isArray(task.tags)
                            ? task.tags.map((tag: any) => typeof tag === "object" && tag !== null ? tag.id : tag)
                            : [],
                    });
                })
                .catch(() => toast.error("Error al cargar la tarea"));
        }
    }, [id, taskId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleTagToggle = (tagId: number) => {
        setForm(prev => ({
            ...prev,
            tagIds: prev.tagIds.includes(tagId)
                ? prev.tagIds.filter(id => id !== tagId)
                : [...prev.tagIds, tagId],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await updateTask(Number(taskId), form);
                toast.success("Tarea actualizada");
            } else {
                await createTask(Number(id), form);
                toast.success("Tarea creada");
            }
            navigate(`/projects/${id}`);
        } catch {
            toast.error("Error al guardar la tarea");
        }
    };

    return (
        <div style={fullScreenContainer}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2>{isEdit ? "Editar Tarea" : "Crear Tarea"}</h2>

                <input
                    name="title"
                    placeholder="Título"
                    value={form.title}
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

                <input
                    name="estimatedHours"
                    type="number"
                    placeholder="Horas estimadas"
                    value={form.estimatedHours}
                    onChange={handleChange}
                    style={styles.input}
                />

                <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    style={styles.input}
                >
                    <option value="TODO">Por hacer</option>
                    <option value="IN_PROGRESS">En progreso</option>
                    <option value="DONE">Hecho</option>
                </select>

                <select
                    name="assignedToEmail"
                    value={form.assignedToEmail}
                    onChange={handleChange}
                    style={styles.input}
                    required
                >
                    <option value="">-- Asignar a --</option>
                    {users.map(email => (
                        <option key={email} value={email}>{email}</option>
                    ))}
                </select>

                <div style={{ textAlign: "left", marginBottom: "1rem" }}>
                    <label><strong>Tags:</strong></label>
                    <div style={styles.tagContainer}>
                        {tags.map((tag) => (
                            <label
                                key={tag.id}
                                style={{
                                    ...styles.tagChip,
                                    backgroundColor: tag.color || "#e0e0e0",
                                    opacity: form.tagIds.includes(tag.id) ? 1 : 0.6,
                                    border: form.tagIds.includes(tag.id) ? "2px solid #000" : "2px solid transparent",
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={form.tagIds.includes(tag.id)}
                                    onChange={() => handleTagToggle(tag.id)}
                                    style={{ display: "none" }}
                                />
                                {tag.name}
                            </label>
                        ))}
                    </div>
                </div>

                <div style={styles.buttonContainer}>
                    <button type="submit" style={styles.button}>{isEdit ? "Actualizar" : "Guardar"}</button>
                    <button type="button" onClick={() => navigate(`/projects/${id}`)} style={styles.cancelButton}>Cancelar</button>
                </div>
            </form>
        </div>
    );
};

const styles = {
    form: {
        maxWidth: "600px",
        margin: "2rem auto",
        padding: "2rem",
        border: "1px solid #ccc",
        borderRadius: "8px",
        background: "#fff",
    },
    input: {
        width: "100%",
        padding: "0.75rem",
        marginBottom: "1rem",
        borderRadius: "4px",
        border: "1px solid #ccc",
    },
    tagList: {
        display: "flex",
        flexWrap: "wrap" as const,
        gap: "0.5rem",
        marginTop: "0.5rem",
    },
    checkboxLabel: {
        fontSize: "0.9rem",
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "1rem",
        marginTop: "1rem",
    },
    button: {
        padding: "0.75rem 1.5rem",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
    cancelButton: {
        padding: "0.75rem 1.5rem",
        backgroundColor: "#6c757d",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
    tagContainer: {
        display: "flex",
        flexWrap: "wrap" as const,
        gap: "0.5rem",
        marginTop: "0.5rem",
        marginBottom: "1rem",
    },
    tagChip: {
        padding: "0.5rem 1rem",
        borderRadius: "20px",
        color: "#fff",
        fontWeight: 500,
        cursor: "pointer",
        userSelect: "none" as const,
        transition: "all 0.2s ease-in-out",
    }
};
