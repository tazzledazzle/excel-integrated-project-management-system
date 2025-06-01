import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import ProjectCard from '../../components/projects/ProjectCard';
import Loading from '../../components/ui/Loading';
import { Project } from '../../types';
import { projectApi } from '../../services/mockApi';

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectApi.getProjects();
        setProjects(data);
        setFilteredProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    // Apply filters and search
    let result = [...projects];

    // Filter by status
    if (filter !== 'all') {
      const now = new Date();

      result = result.filter(project => {
        if (!project.startDate || !project.endDate) {
          return filter === 'not-started';
        }

        const start = new Date(project.startDate);
        const end = new Date(project.endDate);

        switch (filter) {
          case 'upcoming':
            return now < start;
          case 'in-progress':
            return now >= start && now <= end;
          case 'completed':
            return now > end;
          default:
            return true;
        }
      });
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        project =>
          project.name.toLowerCase().includes(term) ||
          (project.description && project.description.toLowerCase().includes(term))
      );
    }

    setFilteredProjects(result);
  }, [searchTerm, filter, projects]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-64px-136px)]">
          <Loading size="lg\" text="Loading projects..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-2">Manage your projects and teams</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/projects/create" className="btn btn-primary">
              <Plus className="h-4 w-4 mr-1" />
              New Project
            </Link>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="input pl-10"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="input pl-10"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Projects</option>
                <option value="not-started">Not Started</option>
                <option value="upcoming">Upcoming</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="card bg-gray-50 p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-500 mb-4">
              {projects.length === 0
                ? "You don't have any projects yet."
                : "No projects match your current filters."}
            </p>
            {projects.length === 0 && (
              <Link to="/projects/create" className="btn btn-primary">
                <Plus className="h-4 w-4 mr-1" />
                Create your first project
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProjectList;