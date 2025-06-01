import React, { useState } from 'react';
import { Check, Copy, FileSpreadsheet } from 'lucide-react';
import { Project } from '../../types';

interface ExcelIntegrationProps {
  projects: Project[];
  onGenerateToken: (projectId: number) => Promise<string>;
}

const ExcelIntegration: React.FC<ExcelIntegrationProps> = ({
  projects,
  onGenerateToken
}) => {
  const [selectedProject, setSelectedProject] = useState<number | ''>('');
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateToken = async () => {
    if (selectedProject === '') return;
    
    setIsLoading(true);
    try {
      const token = await onGenerateToken(Number(selectedProject));
      setToken(token);
      setCopied(false);
    } catch (error) {
      console.error('Failed to generate token:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToken = () => {
    if (!token) return;
    
    navigator.clipboard.writeText(token);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleDownloadTemplate = () => {
    // In a real implementation, this would download the Excel template
    alert('In a real implementation, this would download the Excel template with Office JS Add-In');
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Excel Integration</h2>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          Use Excel to manage timesheets for your projects. Select a project, generate a token,
          and use it in the Excel Add-In to submit timesheet data.
        </p>
        
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
          <div className="flex-1">
            <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">
              Select Project
            </label>
            <select
              id="project"
              className="input"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <option value="" disabled>
                Select a project
              </option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          
          <button
            className="btn btn-primary"
            onClick={handleGenerateToken}
            disabled={selectedProject === '' || isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate Token'}
          </button>
        </div>
        
        {token && (
          <div className="mb-6 p-4 border border-primary-200 rounded-md bg-primary-50">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Token
            </label>
            <div className="flex">
              <input
                type="text"
                value={token}
                readOnly
                className="input rounded-r-none flex-1"
              />
              <button
                className="btn btn-primary rounded-l-none flex items-center px-3"
                onClick={handleCopyToken}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Copy this token and paste it in the Excel Add-In to connect to this project.
            </p>
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Excel Template</h3>
        
        <div className="flex items-center gap-4">
          <FileSpreadsheet className="h-10 w-10 text-secondary-600" />
          <div>
            <p className="font-medium">Timesheet Template</p>
            <p className="text-sm text-gray-600">
              Download the Excel template with the Add-In pre-installed.
            </p>
          </div>
          <button
            className="btn btn-secondary ml-auto"
            onClick={handleDownloadTemplate}
          >
            Download
          </button>
        </div>
        
        <div className="mt-6 bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium mb-2">How to use:</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>Download the Excel template</li>
            <li>Open the template and enable the Add-In</li>
            <li>Generate a token for your project</li>
            <li>Paste the token in the Excel Add-In</li>
            <li>Fill in your timesheet data</li>
            <li>Submit your timesheet directly from Excel</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ExcelIntegration;