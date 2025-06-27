import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getTasksByProject, updateTaskStatus } from "../api/taskService";
import { DragDropContext, Droppable, Draggable, type DropResult } from "react-beautiful-dnd";

type Task = {
  id: number;
  title: string;
  description: string;
  estimatedHours: number;
  assignedToEmail: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
};

export const TaskBoard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (id) {
      getTasksByProject(Number(id))
        .then(setTasks)
        .catch(() => toast.error("Error al cargar tareas"));
    }
  }, [id]);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const taskId = Number(draggableId);
    const newStatus = destination.droppableId as Task["status"];

    updateTaskStatus(taskId, newStatus)
      .then(() => {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        );
      })
      .catch(() => toast.error("Error al actualizar tarea"));
  };

  const grouped = {
    TODO: tasks.filter((t) => t.status === "TODO"),
    IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS"),
    DONE: tasks.filter((t) => t.status === "DONE"),
  };

  return (
    <div>
      <div style={styles.header}>
        <h2>Tablero de Tareas</h2>
        <div>
          <button
            style={{ ...styles.createBtn, marginRight: "1rem" }}
            onClick={() => navigate("/projects")}
          >
            ← Volver a Proyectos
          </button>
          <button
            style={styles.createBtn}
            onClick={() => navigate(`/projects/${id}/tasks/new`)}
          >
            + Nueva Tarea
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div style={styles.board}>
          {(["TODO", "IN_PROGRESS", "DONE"] as const).map((status) => (
            <Droppable droppableId={status} key={status} isDropDisabled={false} isCombineEnabled={true} ignoreContainerClipping={true}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={styles.column}
                >
                  <h3 style={styles.columnHeader}>{status.replace("_", " ")}</h3>
                  <div style={styles.taskList}>
                    {grouped[status].map((task, index) => (
                      <Draggable
                        draggableId={task.id.toString()}
                        index={index}
                        key={task.id}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...styles.taskCard,
                              ...provided.draggableProps.style,
                            }}
                          >
                            <h4>{task.title}</h4>
                            <p>{task.description}</p>
                            <p><strong>Horas:</strong> {task.estimatedHours}</p>
                            <p><strong>Asignado a:</strong> {task.assignedToEmail}</p>
                            <div style={{ marginTop: "0.5rem", textAlign: "right" }}>
                              <button
                                style={styles.editBtn}
                                onClick={() => navigate(`/projects/${id}/tasks/${task.id}/edit`)}
                              >
                                ✏️ Editar
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "1rem 2rem",
  },
  createBtn: {
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  board: {
    display: "flex",
    justifyContent: "space-around",
    padding: "1rem",
    gap: "1rem",
  },
  column: {
    flex: 1,
    minWidth: "280px",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    padding: "1rem",
    height: "70vh",
    overflowY: "auto" as const,
  },
  columnHeader: {
    textAlign: "center" as const,
    borderBottom: "2px solid #ccc",
    paddingBottom: "0.5rem",
    marginBottom: "1rem",
  },
  taskList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1rem",
  },
  taskCard: {
    backgroundColor: "#fff",
    borderRadius: "6px",
    padding: "1rem",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  editBtn: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "0.3rem 0.7rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.85rem",
  },
};
