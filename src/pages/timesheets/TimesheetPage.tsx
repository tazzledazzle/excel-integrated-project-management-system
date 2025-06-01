import React, { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/ui/Loading';
import { projectApi, timesheetApi, taskApi } from '../../services/mockApi';
import { Project, Task, TimesheetEntry } from '../../types';

const TimesheetPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<number | ''>('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimesheetEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTimeEntries, setIsLoadingTimeEntries] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectApi.getProjects();
        setProjects(data);
        
        if (data.length > 0) {
          setSelectedProject(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject === '') return;

    const fetchProjectData = async () => {
      setIsLoadingTimeEntries(true);
      try {
        // Fetch tasks for the selected project
        const tasksData = await taskApi.getTasksByProject(Number(selectedProject));
        setTasks(tasksData);

        // Fetch timesheet entries for the selected project
        const timesheetData = await timesheetApi.getTimesheetEntriesByProject(Number(selectedProject));
        setTimeEntries(timesheetData);
      } catch (error) {
        console.error('Error fetching project data:', error);
      } finally {
        setIsLoadingTimeEntries(false);
      }
    };

    fetchProjectData();
  }, [selectedProject]);

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProject(e.target.value === '' ? '' : Number(e.target.value));
  };

  const getTaskName = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    return task ? task.name : `Task ${taskId}`;
  };

  const formatDateTime = (dateTimeString: string) => {
    try {
      return format(parseISO(dateTimeString), 'MMM d, yyyy h:mm a');
    } catch {
      return dateTimeString;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  // Group timesheet entries by date
  const groupTimeEntriesByDate = () => {
    const grouped: Record<string, TimesheetEntry[]> = {};
    
    timeEntries.forEach(entry => {
      const date = entry.workDate.split('T')[0]; // Get YYYY-MM-DD format
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(entry);
    });
    
    // Sort dates in descending order
    return Object.keys(grouped)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map(date => ({
        date,
        entries: grouped[date]
      }));
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-64px-136px)]">
          <Loading size="lg\" text="Loading timesheet data..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Timesheets</h1>
          <p className="text-gray-600 mt-2">View and manage timesheet submissions</p>
        </div>

        <div className="mb-6">
          <label htmlFor="project-select" className="block text-sm font-medium text-gray-700 mb-1">
            Select Project
          </label>
          <select
            id="project-select"
            className="input max-w-md"
            value={selectedProject}
            onChange={handleProjectChange}
          >
            <option value="" disabled>Select a project</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        {isLoadingTimeEntries ? (
          <div className="flex justify-center py-12">
            <Loading size="md" text="Loading timesheet entries..." />
          </div>
        ) : timeEntries.length === 0 ? (
          <div className="card bg-gray-50 p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No timesheet entries found</h3>
            <p className="text-gray-600">
              No timesheet data has been submitted for this project yet.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Summary Card */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Summary</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-primary-50 rounded-lg p-4 border border-primary-100">
                  <p className="text-sm font-medium text-gray-500">Total Hours</p>
                  <p className="text-2xl font-bold text-primary-700">
                    {timeEntries.reduce((sum, entry) => sum + entry.hoursWorked, 0).toFixed(1)}
                  </p>
                </div>
                <div className="bg-secondary-50 rounded-lg p-4 border border-secondary-100">
                  <p className="text-sm font-medium text-gray-500">Total Entries</p>
                  <p className="text-2xl font-bold text-secondary-700">{timeEntries.length}</p>
                </div>
                <div className="bg-accent-50 rounded-lg p-4 border border-accent-100">
                  <p className="text-sm font-medium text-gray-500">Team Members</p>
                  <p className="text-2xl font-bold text-accent-700">
                    {new Set(timeEntries.map(entry => entry.employeeName)).size}
                  </p>
                </div>
              </div>
            </div>

            {/* Timesheet Entries by Date */}
            {groupTimeEntriesByDate().map(group => (
              <div key={group.date} className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {formatDate(group.date)}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Employee
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Task
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hours
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Notes
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Submitted At
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {group.entries.map(entry => (
                        <tr key={entry.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {entry.employeeName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {getTaskName(entry.taskId)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {entry.hoursWorked}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {entry.notes || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDateTime(entry.submittedAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TimesheetPage;