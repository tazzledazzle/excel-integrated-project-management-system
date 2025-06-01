import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Edit, Trash2, Calendar, Clock, ArrowLeft } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import TaskList from '../../components/tasks/TaskList';
import Loading from '../../components/ui/Loading';
import Modal from '../../components/ui/Modal';
import ProjectForm from '../../components/projects/ProjectForm';
import Notification from '../../components/ui/Notification';
import { Project, Task } from '../../types';
import { projectApi, taskApi } from '../../services/mockApi';
import { format, isValid } from 'date-fns';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const projectId = Number(id);

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const projectData = await projectApi.getProject(projectId);
        setProject(projectData);

        const tasksData = await taskApi.getTasksByProject(projectId);
        setTasks(tasksData);
      } catch (error) {
        console.error('Error fetching project data:', error);
        setNotification({
          type: 'error',
          message: 'Failed to load project. Please try again.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId]);

  const handleUpdateProject = async (data: any) => {
    if (!project) return;

    setIsSubmitting(true);
    try {
      const updatedProject = await projectApi.updateProject(projectId, data);
      setProject(updatedProject);
      setIsEditModalOpen(false);
      setNotification({
        type: 'success',
        message: 'Project updated successfully!'
      });
    } catch (error) {
      console.error('Error updating project:', error);
      setNotification({
        type: 'error',
        message: 'Failed to update project. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async () => {
    setIsSubmitting(true);
    try {
      await projectApi.deleteProject(projectId);
      navigate('/projects');
    } catch (error) {
      console.error('Error deleting project:', error);
      setNotification({
        type: 'error',
        message: 'Failed to delete project. Please try again.'
      });
      setIsSubmitting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleCreateTask = async (data: any) => {
    try {
      const newTask = await taskApi.createTask({
        ...data,
        projectId
      });
      setTasks([...tasks, newTask]);
      setNotification({
        type: 'success',
        message: 'Task created successfully!'
      });
    } catch (error) {
      console.error('Error creating task:', error);
      setNotification({
        type: 'error',
        message: 'Failed to create task. Please try again.'
      });
    }
  };

  const handleUpdateTask = async (taskId: number, data: any) => {
    try {
      const updatedTask = await taskApi.updateTask(taskId, data);
      setTasks(tasks.map(task => (task.id === taskId ? updatedTask : task)));
      setNotification({
        type: 'success',
        message: 'Task updated successfully!'
      });
    } catch (error) {
      console.error('Error updating task:', error);
      setNotification({
        type: 'error',
        message: 'Failed to update task. Please try again.'
      });
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await taskApi.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
      setNotification({
        type: 'success',
        message: 'Task deleted successfully!'
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      setNotification({
        type: 'error',
        message: 'Failed to delete task. Please try again.'
      });
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return isValid(date) ? format(date, 'MMMM d, yyyy') : 'Invalid date';
  };

  // Calculate project status
  const getProjectStatus = () => {
    if (!project?.startDate || !project?.endDate) return 'Not started';

    const now = new Date();
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);

    if (now < start) return 'Upcoming';
    if (now > end) return 'Completed';
    return 'In progress';
  };

  const getStatusColor = () => {
    const status = getProjectStatus();
    switch (status) {
      case 'Upcoming':
        return 'badge-primary';
      case 'In progress':
        return 'badge-accent';
      case 'Completed':
        return 'badge-success';
      default:
        return 'badge-secondary';
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-64px-136px)]">
          <Loading size="lg\" text="Loading project details..." />
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="card bg-gray-50 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Project not found</h2>
            <p className="text-gray-600 mb-6">
              The project you're looking for doesn't exist or you don't have access to it.
            </p>
            <Link to="/projects" className="btn btn-primary">
              Return to Projects
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {notification && (
          <div className="mb-4">
            <Notification
              type={notification.type}
              message={notification.message}
              onClose={() => setNotification(null)}
            />
          </div>
        )}

        <div className="mb-6">
          <Link to="/projects" className="inline-flex items-center text-primary-600 hover:text-primary-700">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Projects
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-card overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h1 className="text-2xl font-bold text-gray-900 mr-3">{project.name}</h1>
                  <span className={`badge ${getStatusColor()}`}>{getProjectStatus()}</span>
                </div>
                <p className="text-gray-600 mb-4">{project.description || 'No description provided.'}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-2 text-primary-600" />
                    <div>
                      <p className="text-sm font-medium">Start Date</p>
                      <p>{formatDate(project.startDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 mr-2 text-primary-600" />
                    <div>
                      <p className="text-sm font-medium">End Date</p>
                      <p>{formatDate(project.endDate)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-0 flex md:flex-col space-x-2 md:space-x-0 md:space-y-2">
                <button
                  className="btn btn-outline flex-1 md:flex-none"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button
                  className="btn btn-error flex-1 md:flex-none"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <TaskList
            tasks={tasks}
            projectId={projectId}
            onCreateTask={handleCreateTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        </div>
      </div>

      {/* Edit Project Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Project"
        size="md"
      >
        <ProjectForm
          project={project}
          onSubmit={handleUpdateProject}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Delete Project Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Project"
        size="sm"
      >
        <div className="text-center">
          <p className="mb-4">Are you sure you want to delete this project?</p>
          <p className="text-gray-600 mb-6">
            <strong>{project.name}</strong>
            <br />
            This will also delete all tasks associated with this project.
            <br />
            This action cannot be undone.
          </p>
          <div className="flex justify-center space-x-3">
            <button
              className="btn btn-outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              className="btn btn-error"
              onClick={handleDeleteProject}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default ProjectDetail;