export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface Project {
  id: number;
  name: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  projectManagerId: number | null;
  taskCount: number;
  createdAt: string;
}

export interface Task {
  id: number;
  projectId: number;
  name: string;
  description: string | null;
  estimatedHours: number | null;
  createdAt: string;
}

export interface TimesheetEntry {
  id: number;
  taskId: number;
  employeeName: string;
  hoursWorked: number;
  workDate: string;
  notes: string | null;
  submittedAt: string;
}

export interface TaskHoursDto {
  taskId: number;
  taskName: string;
  totalHours: number;
}

export interface ProjectCreateDto {
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  projectManagerId?: number;
}

export interface ProjectUpdateDto {
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  projectManagerId?: number;
}

export interface TaskCreateDto {
  projectId: number;
  name: string;
  description?: string;
  estimatedHours?: number;
}

export interface TaskUpdateDto {
  name: string;
  description?: string;
  estimatedHours?: number;
}

export interface TimesheetEntryDto {
  taskId: number;
  employeeName: string;
  hoursWorked: number;
  workDate: string;
  notes?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface ExcelAuthToken {
  token: string;
  projectId: number;
}