import React from 'react';
import { useForm } from 'react-hook-form';
import { TaskCreateDto, TaskUpdateDto, Task } from '../../types';

interface TaskFormProps {
  onSubmit: (data: TaskCreateDto | TaskUpdateDto) => void;
  task?: Task;
  isLoading?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  task,
  isLoading = false
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<TaskCreateDto | TaskUpdateDto>({
    defaultValues: task
      ? {
          name: task.name,
          description: task.description || '',
          estimatedHours: task.estimatedHours || undefined,
          projectId: task.projectId
        }
      : {}
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Task Name <span className="text-error-600">*</span>
        </label>
        <input
          type="text"
          id="name"
          className={`mt-1 input ${errors.name ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
          {...register('name', { required: 'Task name is required' })}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-error-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          className="mt-1 input"
          {...register('description')}
        ></textarea>
      </div>

      <div>
        <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700">
          Estimated Hours
        </label>
        <input
          type="number"
          id="estimatedHours"
          step="0.5"
          min="0"
          className="mt-1 input"
          {...register('estimatedHours', {
            valueAsNumber: true,
            min: {
              value: 0,
              message: 'Hours must be a positive number'
            }
          })}
        />
        {errors.estimatedHours && (
          <p className="mt-1 text-sm text-error-600">{errors.estimatedHours.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : task ? (
            'Update Task'
          ) : (
            'Create Task'
          )}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;