import { 
  User, Project, Task, TimesheetEntry, 
  ProjectCreateDto, ProjectUpdateDto, 
  TaskCreateDto, TaskUpdateDto, 
  TimesheetEntryDto, AuthResponse, LoginCredentials,
  ExcelAuthToken
} from '../types';
import { projects, tasks, timesheetEntries, users } from '../utils/mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper functions
let nextProjectId = projects.length + 1;
let nextTaskId = tasks.length + 1;
let nextTimesheetId = timesheetEntries.length + 1;

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await delay(500);
    
    const user = users.find(u => u.username === credentials.username);
    
    if (!user || credentials.password !== 'password') {
      throw new Error('Invalid credentials');
    }
    
    return {
      token: 'mock-jwt-token',
      user
    };
  },
  
  validateToken: async (): Promise<User> => {
    await delay(200);
    return users[0];
  },
  
  generateExcelToken: async (projectId: number): Promise<ExcelAuthToken> => {
    await delay(300);
    
    const project = projects.find(p => p.id === projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    
    return {
      token: `excel-token-for-project-${projectId}`,
      projectId
    };
  },
  
  validateExcelToken: async (token: string): Promise<boolean> => {
    await delay(200);
    return token.startsWith('excel-token-for-project-');
  }
};

// Projects API
export const projectApi = {
  getProjects: async (): Promise<Project[]> => {
    await delay(500);
    return [...projects];
  },
  
  getProject: async (id: number): Promise<Project> => {
    await delay(300);
    
    const project = projects.find(p => p.id === id);
    if (!project) {
      throw new Error('Project not found');
    }
    
    return project;
  },
  
  createProject: async (projectData: ProjectCreateDto): Promise<Project> => {
    await delay(500);
    
    const newProject: Project = {
      id: nextProjectId++,
      name: projectData.name,
      description: projectData.description || null,
      startDate: projectData.startDate || null,
      endDate: projectData.endDate || null,
      projectManagerId: projectData.projectManagerId || null,
      taskCount: 0,
      createdAt: new Date().toISOString()
    };
    
    projects.push(newProject);
    return newProject;
  },
  
  updateProject: async (id: number, projectData: ProjectUpdateDto): Promise<Project> => {
    await delay(500);
    
    const projectIndex = projects.findIndex(p => p.id === id);
    if (projectIndex === -1) {
      throw new Error('Project not found');
    }
    
    const updatedProject = {
      ...projects[projectIndex],
      name: projectData.name,
      description: projectData.description || null,
      startDate: projectData.startDate || null,
      endDate: projectData.endDate || null,
      projectManagerId: projectData.projectManagerId || null
    };
    
    projects[projectIndex] = updatedProject;
    return updatedProject;
  },
  
  deleteProject: async (id: number): Promise<void> => {
    await delay(500);
    
    const projectIndex = projects.findIndex(p => p.id === id);
    if (projectIndex === -1) {
      throw new Error('Project not found');
    }
    
    projects.splice(projectIndex, 1);
    
    // Remove associated tasks
    const projectTasks = tasks.filter(t => t.projectId === id);
    projectTasks.forEach(task => {
      const taskIndex = tasks.findIndex(t => t.id === task.id);
      if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
      }
    });
  }
};

// Tasks API
export const taskApi = {
  getTasksByProject: async (projectId: number): Promise<Task[]> => {
    await delay(400);
    return tasks.filter(t => t.projectId === projectId);
  },
  
  getTask: async (id: number): Promise<Task> => {
    await delay(300);
    
    const task = tasks.find(t => t.id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    
    return task;
  },
  
  createTask: async (taskData: TaskCreateDto): Promise<Task> => {
    await delay(500);
    
    const newTask: Task = {
      id: nextTaskId++,
      projectId: taskData.projectId,
      name: taskData.name,
      description: taskData.description || null,
      estimatedHours: taskData.estimatedHours || null,
      createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    
    // Update task count in project
    const projectIndex = projects.findIndex(p => p.id === taskData.projectId);
    if (projectIndex !== -1) {
      projects[projectIndex].taskCount++;
    }
    
    return newTask;
  },
  
  updateTask: async (id: number, taskData: TaskUpdateDto): Promise<Task> => {
    await delay(500);
    
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    const updatedTask = {
      ...tasks[taskIndex],
      name: taskData.name,
      description: taskData.description || null,
      estimatedHours: taskData.estimatedHours || null
    };
    
    tasks[taskIndex] = updatedTask;
    return updatedTask;
  },
  
  deleteTask: async (id: number): Promise<void> => {
    await delay(500);
    
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    const projectId = tasks[taskIndex].projectId;
    tasks.splice(taskIndex, 1);
    
    // Update task count in project
    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex !== -1 && projects[projectIndex].taskCount > 0) {
      projects[projectIndex].taskCount--;
    }
  }
};

// Timesheet API
export const timesheetApi = {
  getTimesheetEntriesByProject: async (projectId: number): Promise<TimesheetEntry[]> => {
    await delay(500);
    
    const projectTaskIds = tasks
      .filter(t => t.projectId === projectId)
      .map(t => t.id);
    
    return timesheetEntries.filter(entry => projectTaskIds.includes(entry.taskId));
  },
  
  getTimesheetEntriesByTask: async (taskId: number): Promise<TimesheetEntry[]> => {
    await delay(400);
    return timesheetEntries.filter(entry => entry.taskId === taskId);
  },
  
  submitTimesheetEntry: async (entryData: TimesheetEntryDto): Promise<TimesheetEntry> => {
    await delay(500);
    
    const newEntry: TimesheetEntry = {
      id: nextTimesheetId++,
      taskId: entryData.taskId,
      employeeName: entryData.employeeName,
      hoursWorked: entryData.hoursWorked,
      workDate: entryData.workDate,
      notes: entryData.notes || null,
      submittedAt: new Date().toISOString()
    };
    
    timesheetEntries.push(newEntry);
    return newEntry;
  },
  
  submitBatchTimesheetEntries: async (entries: TimesheetEntryDto[]): Promise<TimesheetEntry[]> => {
    await delay(700);
    
    const newEntries: TimesheetEntry[] = entries.map(entry => ({
      id: nextTimesheetId++,
      taskId: entry.taskId,
      employeeName: entry.employeeName,
      hoursWorked: entry.hoursWorked,
      workDate: entry.workDate,
      notes: entry.notes || null,
      submittedAt: new Date().toISOString()
    }));
    
    timesheetEntries.push(...newEntries);
    return newEntries;
  }
};