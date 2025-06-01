import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, Clock, Activity, Users } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Loading from '../components/ui/Loading';
import { projectApi, taskApi, timesheetApi } from '../services/mockApi';
import { Project, Task, TimesheetEntry } from '../types';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [recentTimeEntries, setRecentTimeEntries] = useState<TimesheetEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const projectsData = await projectApi.getProjects();
        setProjects(projectsData);

        if (projectsData.length > 0) {
          // Fetch tasks for the first project
          const tasksData = await taskApi.getTasksByProject(projectsData[0].id);
          setRecentTasks(tasksData.slice(0, 5));

          // Fetch timesheet entries for the first project
          const timesheetData = await timesheetApi.getTimesheetEntriesByProject(projectsData[0].id);
          setRecentTimeEntries(timesheetData.slice(0, 5));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Project status distribution for Pie chart
  const getProjectStatusData = () => {
    const statusCounts = {
      'Not started': 0,
      'Upcoming': 0,
      'In progress': 0,
      'Completed': 0
    };

    projects.forEach(project => {
      if (!project.startDate || !project.endDate) {
        statusCounts['Not started']++;
        return;
      }

      const now = new Date();
      const start = new Date(project.startDate);
      const end = new Date(project.endDate);

      if (now < start) statusCounts['Upcoming']++;
      else if (now > end) statusCounts['Completed']++;
      else statusCounts['In progress']++;
    });

    return {
      labels: Object.keys(statusCounts),
      datasets: [
        {
          data: Object.values(statusCounts),
          backgroundColor: [
            'rgba(148, 163, 184, 0.7)', // Not started - gray
            'rgba(59, 130, 246, 0.7)',  // Upcoming - blue (primary)
            'rgba(249, 115, 22, 0.7)',  // In progress - orange (accent)
            'rgba(34, 197, 94, 0.7)'    // Completed - green (success)
          ],
          borderColor: [
            'rgb(148, 163, 184)',
            'rgb(59, 130, 246)',
            'rgb(249, 115, 22)',
            'rgb(34, 197, 94)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  // Hours by task for Bar chart
  const getHoursByTaskData = () => {
    // Group timesheet entries by task
    const taskHours: Record<string, number> = {};
    const taskNames: Record<number, string> = {};

    recentTasks.forEach(task => {
      taskNames[task.id] = task.name;
      taskHours[task.name] = 0;
    });

    recentTimeEntries.forEach(entry => {
      const taskName = taskNames[entry.taskId] || `Task ${entry.taskId}`;
      taskHours[taskName] = (taskHours[taskName] || 0) + entry.hoursWorked;
    });

    return {
      labels: Object.keys(taskHours),
      datasets: [
        {
          label: 'Hours Logged',
          data: Object.values(taskHours),
          backgroundColor: 'rgba(59, 130, 246, 0.7)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1
        }
      ]
    };
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-64px-136px)]">
          <Loading size="lg\" text="Loading dashboard..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's an overview of your projects.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card bg-white shadow-sm transition-all hover:shadow-md border-l-4 border-primary-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary-100 text-primary-600">
                <Calendar className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Projects</p>
                <p className="text-2xl font-semibold text-gray-900">{projects.length}</p>
              </div>
            </div>
          </div>

          <div className="card bg-white shadow-sm transition-all hover:shadow-md border-l-4 border-secondary-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-secondary-100 text-secondary-600">
                <Clock className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Projects</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {projects.filter(p => p.startDate && p.endDate && new Date() >= new Date(p.startDate) && new Date() <= new Date(p.endDate)).length}
                </p>
              </div>
            </div>
          </div>

          <div className="card bg-white shadow-sm transition-all hover:shadow-md border-l-4 border-accent-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-accent-100 text-accent-600">
                <Activity className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Tasks</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {projects.reduce((sum, project) => sum + project.taskCount, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="card bg-white shadow-sm transition-all hover:shadow-md border-l-4 border-success-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-success-100 text-success-600">
                <Users className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Team Members</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {new Set(recentTimeEntries.map(entry => entry.employeeName)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Status Overview</h2>
            <div className="h-64">
              <Pie data={getProjectStatusData()} options={{ maintainAspectRatio: false }} />
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Hours by Task</h2>
            <div className="h-64">
              <Bar 
                data={getHoursByTaskData()} 
                options={{ 
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Hours'
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Projects</h2>
            <Link to="/projects/create" className="btn btn-primary">
              <Plus className="h-4 w-4 mr-1" />
              New Project
            </Link>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tasks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projects.slice(0, 5).map((project) => {
                    // Calculate project status based on dates
                    let status = 'Not started';
                    let statusColor = 'badge-secondary';
                    
                    if (project.startDate && project.endDate) {
                      const now = new Date();
                      const start = new Date(project.startDate);
                      const end = new Date(project.endDate);
                      
                      if (now < start) {
                        status = 'Upcoming';
                        statusColor = 'badge-primary';
                      } else if (now > end) {
                        status = 'Completed';
                        statusColor = 'badge-success';
                      } else {
                        status = 'In progress';
                        statusColor = 'badge-accent';
                      }
                    }

                    return (
                      <tr key={project.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link to={`/projects/${project.id}`} className="text-primary-600 hover:text-primary-900 font-medium">
                            {project.name}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`badge ${statusColor}`}>{status}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-gray-900">{project.taskCount}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not set'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Not set'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {projects.length > 5 && (
              <div className="px-6 py-3 bg-gray-50 text-right">
                <Link to="/projects" className="text-primary-600 hover:text-primary-900 text-sm font-medium">
                  View all projects →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="card">
            {recentTimeEntries.length > 0 ? (
              <div className="space-y-4">
                {recentTimeEntries.map((entry) => {
                  const task = recentTasks.find(t => t.id === entry.taskId);
                  return (
                    <div key={entry.id} className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                          {entry.employeeName.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {entry.employeeName} logged {entry.hoursWorked} hours on{' '}
                          <span className="text-primary-600">{task?.name || `Task ${entry.taskId}`}</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(entry.workDate).toLocaleDateString()} • {new Date(entry.submittedAt).toLocaleTimeString()}
                        </p>
                        {entry.notes && (
                          <p className="mt-1 text-sm text-gray-600">{entry.notes}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent activity to display.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;