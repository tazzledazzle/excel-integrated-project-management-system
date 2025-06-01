import { User, Project, Task, TimesheetEntry } from '../types';
import { add, format, sub } from 'date-fns';

// Mock Users
export const users: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    role: 'PROJECT_MANAGER',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 2,
    username: 'pm1',
    email: 'pm1@example.com',
    role: 'PROJECT_MANAGER',
    createdAt: '2025-01-02T00:00:00Z',
  },
  {
    id: 3,
    username: 'user1',
    email: 'user1@example.com',
    role: 'USER',
    createdAt: '2025-01-03T00:00:00Z',
  },
];

// Mock Projects
export const projects: Project[] = [
  {
    id: 1,
    name: 'Website Redesign',
    description: 'Complete overhaul of the company website',
    startDate: format(sub(new Date(), { days: 30 }), 'yyyy-MM-dd'),
    endDate: format(add(new Date(), { days: 60 }), 'yyyy-MM-dd'),
    projectManagerId: 1,
    taskCount: 4,
    createdAt: '2025-01-10T00:00:00Z',
  },
  {
    id: 2,
    name: 'Mobile App Development',
    description: 'Create a new mobile app for customer engagement',
    startDate: format(sub(new Date(), { days: 15 }), 'yyyy-MM-dd'),
    endDate: format(add(new Date(), { days: 90 }), 'yyyy-MM-dd'),
    projectManagerId: 2,
    taskCount: 3,
    createdAt: '2025-01-15T00:00:00Z',
  },
  {
    id: 3,
    name: 'CRM Implementation',
    description: 'Deploy and customize new CRM system',
    startDate: format(add(new Date(), { days: 15 }), 'yyyy-MM-dd'),
    endDate: format(add(new Date(), { days: 120 }), 'yyyy-MM-dd'),
    projectManagerId: 1,
    taskCount: 2,
    createdAt: '2025-01-20T00:00:00Z',
  },
];

// Mock Tasks
export const tasks: Task[] = [
  {
    id: 1,
    projectId: 1,
    name: 'Design mockups',
    description: 'Create wireframes and design mockups for all pages',
    estimatedHours: 40,
    createdAt: '2025-01-11T00:00:00Z',
  },
  {
    id: 2,
    projectId: 1,
    name: 'Frontend implementation',
    description: 'Implement the frontend based on approved mockups',
    estimatedHours: 80,
    createdAt: '2025-01-12T00:00:00Z',
  },
  {
    id: 3,
    projectId: 1,
    name: 'Backend development',
    description: 'Develop API endpoints and database schema',
    estimatedHours: 60,
    createdAt: '2025-01-13T00:00:00Z',
  },
  {
    id: 4,
    projectId: 1,
    name: 'Testing and deployment',
    description: 'Perform QA testing and deploy to production',
    estimatedHours: 30,
    createdAt: '2025-01-14T00:00:00Z',
  },
  {
    id: 5,
    projectId: 2,
    name: 'App wireframing',
    description: 'Create wireframes for the mobile app',
    estimatedHours: 25,
    createdAt: '2025-01-16T00:00:00Z',
  },
  {
    id: 6,
    projectId: 2,
    name: 'App development',
    description: 'Develop the mobile app for iOS and Android',
    estimatedHours: 120,
    createdAt: '2025-01-17T00:00:00Z',
  },
  {
    id: 7,
    projectId: 2,
    name: 'App testing',
    description: 'Test the app on multiple devices',
    estimatedHours: 40,
    createdAt: '2025-01-18T00:00:00Z',
  },
  {
    id: 8,
    projectId: 3,
    name: 'Requirements gathering',
    description: 'Gather requirements from stakeholders',
    estimatedHours: 20,
    createdAt: '2025-01-21T00:00:00Z',
  },
  {
    id: 9,
    projectId: 3,
    name: 'System configuration',
    description: 'Configure the CRM system based on requirements',
    estimatedHours: 50,
    createdAt: '2025-01-22T00:00:00Z',
  },
];

// Mock Timesheet Entries
export const timesheetEntries: TimesheetEntry[] = [
  {
    id: 1,
    taskId: 1,
    employeeName: 'John Doe',
    hoursWorked: 8,
    workDate: format(sub(new Date(), { days: 5 }), 'yyyy-MM-dd'),
    notes: 'Completed homepage wireframes',
    submittedAt: '2025-02-01T10:00:00Z',
  },
  {
    id: 2,
    taskId: 1,
    employeeName: 'John Doe',
    hoursWorked: 6,
    workDate: format(sub(new Date(), { days: 4 }), 'yyyy-MM-dd'),
    notes: 'Worked on about page design',
    submittedAt: '2025-02-02T10:00:00Z',
  },
  {
    id: 3,
    taskId: 2,
    employeeName: 'Jane Smith',
    hoursWorked: 7.5,
    workDate: format(sub(new Date(), { days: 3 }), 'yyyy-MM-dd'),
    notes: 'Started implementing the homepage',
    submittedAt: '2025-02-03T10:00:00Z',
  },
  {
    id: 4,
    taskId: 3,
    employeeName: 'Mike Johnson',
    hoursWorked: 8,
    workDate: format(sub(new Date(), { days: 2 }), 'yyyy-MM-dd'),
    notes: 'Created database schema',
    submittedAt: '2025-02-04T10:00:00Z',
  },
  {
    id: 5,
    taskId: 5,
    employeeName: 'Sarah Williams',
    hoursWorked: 6,
    workDate: format(sub(new Date(), { days: 1 }), 'yyyy-MM-dd'),
    notes: 'Created app wireframes',
    submittedAt: '2025-02-05T10:00:00Z',
  },
];