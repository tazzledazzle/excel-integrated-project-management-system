import React from 'react';
import { Project } from '../../types';
import { useToast } from '../../context/ToastContext';

interface ExcelProjectSelectorProps {
  projects: Project[];
  selectedProject: number | null;
  onProjectSelect: (projectId: number) => void;
  disabled?: boolean;
}

const ExcelProjectSelector: React.FC<ExcelProjectSelectorProps> = ({
  projects,
  selectedProject,
  onProjectSelect,
  disabled = false
}) => {
  const { showToast } = useToast();

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const projectId = Number(e.target.value);
    if (projectId) {
      onProjectSelect(projectId);
      showToast('Project selected successfully', 'success');
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">
        Select Project
      </label>
      <select
        id="project"
        className="input w-full"
        value={selectedProject || ''}
        onChange={handleProjectChange}
        disabled={disabled}
      >
        <option value="">Select a project</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ExcelProjectSelector;