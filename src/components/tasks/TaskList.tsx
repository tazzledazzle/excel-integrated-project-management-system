import React, { useState } from 'react';
import { Task } from '../../types';
import { Edit, Trash2, Plus } from 'lucide-react';
import Modal from '../ui/Modal';
import TaskForm from './TaskForm';

interface TaskListProps {
  tasks: Task[];
  projectId: number;
  onCreateTask: (task: any) => Promise<void>;
  onUpdateTask: (id: number, task: any) => Promise<void>;
  onDeleteTask: (id: number) => Promise<void>;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  projectId,
  onCreateTask,
  onUpdateTask,
  onDeleteTask
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateTask = async (data: any) => {
    setIsLoading(true);
    try {
      await onCreateTask({ ...data, projectId });
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTask = async (data: any) => {
    if (!selectedTask) return;
    
    setIsLoading(true);
    try {
      await onUpdateTask(selectedTask.id, data);
      setIsEditModalOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Failed to update task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;
    
    setIsLoading(true);
    try {
      await onDeleteTask(selectedTask.id);
      setIsDeleteModalOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Failed to delete task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
        <button
          className="btn btn-primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="card bg-gray-50 p-8 text-center">
          <p className="text-gray-500">No tasks yet. Click "Add Task" to create a task.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Estimated Hours</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td className="font-medium text-gray-900">{task.name}</td>
                  <td>{task.description || 'No description'}</td>
                  <td>{task.estimatedHours || 'Not estimated'}</td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        className="p-1 text-gray-500 hover:text-primary-600 rounded-full hover:bg-gray-100"
                        onClick={() => {
                          setSelectedTask(task);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="p-1 text-gray-500 hover:text-error-600 rounded-full hover:bg-gray-100"
                        onClick={() => {
                          setSelectedTask(task);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Task Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Task"
        size="md"
      >
        <TaskForm
          onSubmit={handleCreateTask}
          isLoading={isLoading}
        />
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTask(null);
        }}
        title="Edit Task"
        size="md"
      >
        <TaskForm
          task={selectedTask || undefined}
          onSubmit={handleUpdateTask}
          isLoading={isLoading}
        />
      </Modal>

      {/* Delete Task Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedTask(null);
        }}
        title="Delete Task"
        size="sm"
      >
        <div className="text-center">
          <p className="mb-4">Are you sure you want to delete this task?</p>
          <p className="text-gray-600 mb-6">
            <strong>{selectedTask?.name}</strong>
            <br />
            This action cannot be undone.
          </p>
          <div className="flex justify-center space-x-3">
            <button
              className="btn btn-outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedTask(null);
              }}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              className="btn btn-error"
              onClick={handleDeleteTask}
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TaskList;