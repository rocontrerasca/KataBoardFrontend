import api from "./axios";

export interface TaskRequest {
  title: string;
  description: string;
  estimatedHours: string;
  status: string;
  assignedToEmail: string;
  tags: string[];
}

export interface TaskResponse extends TaskRequest {
  id: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export const getTasksByProject = (projectId: number) =>
  api.get(`tasks/project/${projectId}`).then(res => res.data);

export const createTask = (projectId: number, task: any) =>
  api.post(`tasks/project/${projectId}`, task).then(res => res.data);

export const updateTask = (taskId: number, task: any) =>
  api.put(`/tasks/${taskId}`, task).then(res => res.data);

export const getTaskById = (taskId: number): Promise<TaskResponse> => {
  return api.get(`/tasks/${taskId}`).then(res => res.data);
};

export const deleteTask = (projectId: number, taskId: number) => {
  return api.delete(`/projects/${projectId}/tasks/${taskId}`);
};

export const updateTaskStatus = async (taskId: number, newStatus: string) => {
  await api.put(`/tasks/${taskId}/status`, { status: newStatus });
};