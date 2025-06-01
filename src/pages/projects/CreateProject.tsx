import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import ProjectForm from '../../components/projects/ProjectForm';
import Notification from '../../components/ui/Notification';
import { ProjectCreateDto } from '../../types';
import { projectApi } from '../../services/mockApi';

const CreateProject: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateProject = async (data: ProjectCreateDto) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const newProject = await projectApi.createProject(data);
      navigate(`/projects/${newProject.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      setError('Failed to create project. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/projects" className="inline-flex items-center text-primary-600 hover:text-primary-700">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Projects
          </Link>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-card overflow-hidden">
            <div className="p-6 sm:p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Project</h1>
              
              {error && (
                <div className="mb-6">
                  <Notification
                    type="error"
                    message={error}
                    onClose={() => setError(null)}
                  />
                </div>
              )}
              
              <ProjectForm
                onSubmit={handleCreateProject}
                isLoading={isSubmitting}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProject;