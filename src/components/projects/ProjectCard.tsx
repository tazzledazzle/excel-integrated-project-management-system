import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../../types';
import { format, isValid } from 'date-fns';
import { Calendar, Clock, CheckSquare } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { id, name, description, startDate, endDate, taskCount } = project;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return isValid(date) ? format(date, 'MMM d, yyyy') : 'Invalid date';
  };

  // Calculate project status based on dates
  const getProjectStatus = () => {
    if (!startDate || !endDate) return 'Not started';
    
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
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

  return (
    <Link to={`/projects/${id}`}>
      <div className="card hover:shadow-lg transition-medium h-full flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{name}</h3>
            <span className={`badge ${getStatusColor()}`}>{getProjectStatus()}</span>
          </div>
          
          <p className="text-gray-600 mb-4 line-clamp-2">
            {description || 'No description provided'}
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Start: {formatDate(startDate)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-2" />
              <span>End: {formatDate(endDate)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <CheckSquare className="h-4 w-4 mr-2" />
              <span>{taskCount} {taskCount === 1 ? 'task' : 'tasks'}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <span className="text-sm font-medium text-primary-600 hover:text-primary-700">
            View details →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;