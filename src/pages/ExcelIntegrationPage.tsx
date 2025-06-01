import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import ExcelAuthDialog from '../components/excel/ExcelAuthDialog';
import ExcelProjectSelector from '../components/excel/ExcelProjectSelector';
import ExcelSubmissionConfirm from '../components/excel/ExcelSubmissionConfirm';
import { useExcel } from '../hooks/useExcel';
import { useToast } from '../context/ToastContext';
import { Project, Task, TimesheetEntryDto } from '../types';
import { projectApi, taskApi, timesheetApi } from '../services/mockApi';
import { FileSpreadsheet } from 'lucide-react';

const ExcelIntegrationPage: React.FC = () => {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timesheetEntries, setTimesheetEntries] = useState<TimesheetEntryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    isInitialized,
    initialize,
    populateTaskDropdowns,
    collectTimesheetData,
    updateSubmissionStatus
  } = useExcel();

  const { showToast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectApi.getProjects();
        setProjects(data);
      } catch (error) {
        showToast('Failed to load projects', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [showToast]);

  useEffect(() => {
    if (selectedProject) {
      const fetchTasks = async () => {
        try {
          const data = await taskApi.getTasksByProject(selectedProject);
          setTasks(data);
          if (isInitialized) {
            await populateTaskDropdowns(data);
          }
        } catch (error) {
          showToast('Failed to load tasks', 'error');
        }
      };

      fetchTasks();
    }
  }, [selectedProject, isInitialized, populateTaskDropdowns, showToast]);

  const handleProjectSelect = (projectId: number) => {
    setSelectedProject(projectId);
  };

  const handleAuthSuccess = async (token: string) => {
    setShowAuthDialog(false);
    try {
      await initialize();
      if (tasks.length > 0) {
        await populateTaskDropdowns(tasks);
      }
    } catch (error) {
      showToast('Failed to initialize Excel integration', 'error');
    }
  };

  const handleCollectData = async () => {
    const entries = await collectTimesheetData();
    if (entries && entries.length > 0) {
      setTimesheetEntries(entries);
      setShowSubmitDialog(true);
    } else {
      showToast('No timesheet entries found', 'warning');
    }
  };

  const handleSubmitTimesheet = async () => {
    try {
      await timesheetApi.submitBatchTimesheetEntries(timesheetEntries);
      await updateSubmissionStatus(
        timesheetEntries.map((_, index) => index + 5),
        'Submitted'
      );
      showToast('Timesheet submitted successfully', 'success');
      setShowSubmitDialog(false);
      setTimesheetEntries([]);
    } catch (error) {
      showToast('Failed to submit timesheet', 'error');
      await updateSubmissionStatus(
        timesheetEntries.map((_, index) => index + 5),
        'Failed'
      );
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Excel Integration</h1>
          <p className="text-gray-600 mt-2">
            Connect Excel to your projects for seamless timesheet submission
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Selection</h2>
              <ExcelProjectSelector
                projects={projects}
                selectedProject={selectedProject}
                onProjectSelect={handleProjectSelect}
                disabled={isLoading}
              />
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Excel Connection</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  {isInitialized
                    ? 'Excel is connected and ready to use'
                    : 'Connect Excel to start submitting timesheets'}
                </p>
                <button
                  className="btn btn-primary w-full"
                  onClick={() => setShowAuthDialog(true)}
                  disabled={!selectedProject}
                >
                  {isInitialized ? 'Reconnect Excel' : 'Connect Excel'}
                </button>
                {isInitialized && (
                  <button
                    className="btn btn-secondary w-full"
                    onClick={handleCollectData}
                  >
                    Submit Timesheet
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-4 mb-6">
              <FileSpreadsheet className="h-10 w-10 text-primary-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Excel Template</h2>
                <p className="text-gray-600">Download the Excel template with the Add-In</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Template Features:</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Pre-configured task dropdown lists</li>
                  <li>• Automatic date calculations</li>
                  <li>• Input validation</li>
                  <li>• Submission status tracking</li>
                </ul>
              </div>

              <button className="btn btn-outline w-full">
                Download Template
              </button>
            </div>
          </div>
        </div>

        {showAuthDialog && (
          <ExcelAuthDialog
            onSuccess={handleAuthSuccess}
            onClose={() => setShowAuthDialog(false)}
          />
        )}

        {showSubmitDialog && (
          <ExcelSubmissionConfirm
            entries={timesheetEntries}
            onConfirm={handleSubmitTimesheet}
            onCancel={() => setShowSubmitDialog(false)}
          />
        )}
      </div>
    </Layout>
  );
};

export default ExcelIntegrationPage;