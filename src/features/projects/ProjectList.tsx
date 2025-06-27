import { useEffect, useState } from "react";
import { getProjects, type Project } from "../../api/projectService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner";

const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProjects()
      .then(setProjects)
      .catch((err) => {
        console.error(err); // opcional para depurar
        toast.error("Error al cargar proyectos");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ margin: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Mis Proyectos</h2>
        <button onClick={() => navigate("/projects/new")}>+ Nuevo Proyecto</button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
        {projects.map((project) => (
          <div
            key={project.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              width: "300px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h3 style={{ marginBottom: "0.5rem" }}>{project.name}</h3>
              <p style={{ marginBottom: "0.5rem" }}>{project.description}</p>
              <p><strong>Estado:</strong> {project.status}</p>
              {Array.isArray(project.collaboratorEmails) && project.collaboratorEmails.length > 0 && (
                <div style={{ marginTop: "0.5rem" }}>
                  <strong>Colaboradores:</strong>
                  <ul style={{ paddingLeft: "1rem", margin: 0 }}>
                    {project.collaboratorEmails.map((email) => (
                      <li key={email} style={{ fontSize: "0.9rem", color: "#555" }}>{email}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <button
              onClick={() => navigate(`/projects/${project.id}`)}
              style={{
                marginTop: "1rem",
                padding: "0.5rem",
                backgroundColor: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Ver Tablero
            </button>
            <button onClick={() => navigate(`/projects/${project.id}/edit`)}>
              Editar
            </button>
          </div>
        ))}
      </div>

      {loading && <LoadingSpinner />}
    </div>
  );
};

export default ProjectList;
