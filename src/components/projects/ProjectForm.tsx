import React from 'react';
import { useForm } from 'react-hook-form';
import { ProjectCreateDto, ProjectUpdateDto, Project } from '../../types';
import { useToast } from '../../context/ToastContext';

interface ProjectFormProps {
  onSubmit: (data: ProjectCreateDto | ProjectUpdateDto) => void;
  project?: Project;
  isLoading?: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  onSubmit,
  project,
  isLoading = false
}) => {
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ProjectCreateDto | ProjectUpdateDto>({
    defaultValues: project
      ? {
          name: project.name,
          description: project.description || '',
          startDate: project.startDate || '',
          endDate: project.endDate || '',
          projectManagerId: project.projectManagerId || undefined
        }
      : {}
  });

  const onSubmitWithValidation = async (data: ProjectCreateDto | ProjectUpdateDto) => {
    try {
      await onSubmit(data);
      showToast('Project saved successfully!', 'success');
    } catch (error) {
      showToast('Failed to save project. Please try again.', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitWithValidation)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Project Name <span className="text-error-600">*</span>
        </label>
        <input
          type="text"
          id="name"
          className={`mt-1 input ${errors.name ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
          {...register('name', { 
            required: 'Project name is required',
            minLength: { value: 3, message: 'Name must be at least 3 characters' }
          })}
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
          rows={4}
          className="mt-1 input"
          {...register('description', {
            maxLength: { value: 500, message: 'Description must be less than 500 characters' }
          })}
        ></textarea>
        {errors.description && (
          <p className="mt-1 text-sm text-error-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            className="mt-1 input"
            {...register('startDate')}
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            className="mt-1 input"
            {...register('endDate', {
              validate: (value, formValues) => {
                if (value && formValues.startDate && value < formValues.startDate) {
                  return 'End date must be after start date';
                }
                return true;
              }
            })}
          />
          {errors.endDate && (
            <p className="mt-1 text-sm text-error-600">{errors.endDate.message}</p>
          )}
        </div>
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
          ) : project ? (
            'Update Project'
          ) : (
            'Create Project'
          )}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm