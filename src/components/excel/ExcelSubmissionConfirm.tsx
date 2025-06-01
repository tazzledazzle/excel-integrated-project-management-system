import React from 'react';
import { TimesheetEntryDto } from '../../types';

interface ExcelSubmissionConfirmProps {
  entries: TimesheetEntryDto[];
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const ExcelSubmissionConfirm: React.FC<ExcelSubmissionConfirmProps> = ({
  entries,
  onConfirm,
  onCancel,
  isSubmitting = false
}) => {
  const totalHours = entries.reduce((sum, entry) => sum + entry.hoursWorked, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Confirm Timesheet Submission</h2>
        
        <div className="mb-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-2">Summary:</p>
            <ul className="space-y-2">
              <li className="text-sm">
                <span className="font-medium">Total Entries:</span> {entries.length}
              </li>
              <li className="text-sm">
                <span className="font-medium">Total Hours:</span> {totalHours}
              </li>
              <li className="text-sm">
                <span className="font-medium">Employee:</span> {entries[0]?.employeeName}
              </li>
            </ul>
          </div>
          
          <p className="text-sm text-gray-600">
            Are you sure you want to submit these timesheet entries? This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-outline"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Timesheet'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExcelSubmissionConfirm;