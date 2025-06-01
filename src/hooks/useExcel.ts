import { useState } from 'react';
import { excelService } from '../services/excelService';
import { Task, TimesheetEntryDto } from '../types';
import { useToast } from '../context/ToastContext';

export const useExcel = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const initialize = async () => {
    try {
      setIsLoading(true);
      await excelService.initialize();
      setIsInitialized(true);
      showToast('Excel integration initialized successfully', 'success');
    } catch (error) {
      showToast('Failed to initialize Excel integration', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const populateTaskDropdowns = async (tasks: Task[]) => {
    if (!isInitialized) {
      showToast('Excel integration not initialized', 'error');
      return;
    }

    try {
      setIsLoading(true);
      await excelService.populateTaskDropdowns(tasks);
      showToast('Task dropdowns populated successfully', 'success');
    } catch (error) {
      showToast('Failed to populate task dropdowns', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const collectTimesheetData = async (): Promise<TimesheetEntryDto[] | null> => {
    if (!isInitialized) {
      showToast('Excel integration not initialized', 'error');
      return null;
    }

    try {
      setIsLoading(true);
      return await excelService.collectTimesheetData();
    } catch (error) {
      showToast('Failed to collect timesheet data', 'error');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSubmissionStatus = async (rows: number[], status: 'Submitted' | 'Failed') => {
    if (!isInitialized) {
      showToast('Excel integration not initialized', 'error');
      return;
    }

    try {
      setIsLoading(true);
      await excelService.updateSubmissionStatus(rows, status);
    } catch (error) {
      showToast('Failed to update submission status', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isInitialized,
    isLoading,
    initialize,
    populateTaskDropdowns,
    collectTimesheetData,
    updateSubmissionStatus
  };
};