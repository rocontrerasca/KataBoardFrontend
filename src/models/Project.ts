export interface Project {
  id: number;
  name: string;
  description: string;
  ownerEmail: string;
  active: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  collaboratorEmails: string[];
}
