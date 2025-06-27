import api from "./axios";

export interface Project {
  id: number;
  name: string;
  description: string;
  ownerEmail: string;
  active: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  collaboratorEmails?: string[];
}

export interface ProjectRequest {
  name: string;
  description: string;
  status: string;
  collaborators?: string[];
}

export const getProjects = (): Promise<Project[]> => {
  return api.get("/projects", ).then(res => res.data);
};

export const getProjectById = (id: number): Promise<Project> => {
  return api.get(`/projects/${id}`).then(res => res.data);
};

export const createProject = (data: ProjectRequest): Promise<Project> => {
  return api.post("/projects", data).then(res => res.data);
};

export const updateProject = (id: number, data: ProjectRequest): Promise<Project> => {
  return api.put(`/projects/${id}`, data).then(res => res.data);
};

export const deleteProject = (id: number): Promise<void> => {
  return api.delete(`/projects/${id}`).then(res => res.data);
};

export const getUsers = (): Promise<string[]> => {
  return api.get("/users/emails/distinct").then((res) => res.data);
};

export const getAllUsers = (): Promise<string[]> => {
  return api.get("/users/emails").then((res) => res.data);
};