import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";
import { ProjectForm } from "./projects/ProjectForm";

export default function EditProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<{
    name: string;
    description: string;
    status: string;
    collaborators: string[];
  } | null>(null);

  useEffect(() => {
    api
      .get(`/projects/${id}`)
      .then((res) => {
        setInitialData({
          name: res.data.name,
          description: res.data.description,
          status: res.data.status,
          collaborators: res.data.collaboratorEmails || [],
        });
      })
      .catch(() => toast.error("Error al cargar el proyecto"));
  }, [id]);

  const handleUpdate = async (formData: any) => {
    await api.put(`/projects/${id}`, formData);
    toast.success("Proyecto actualizado");
    navigate("/projects");
  };

  if (!initialData) return <p>Cargando proyecto...</p>;

  return <ProjectForm initialData={initialData} onSubmit={handleUpdate} />;
}
