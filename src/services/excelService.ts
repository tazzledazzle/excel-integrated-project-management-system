import { Task, TimesheetEntryDto } from '../types';

declare const Office: any;
declare const Excel: any;

export class ExcelService {
  private static instance: ExcelService;
  private initialized: boolean = false;

  private constructor() {}

  static getInstance(): ExcelService {
    if (!ExcelService.instance) {
      ExcelService.instance = new ExcelService();
    }
    return ExcelService.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await Office.onReady();
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize Excel service:', error);
      throw new Error('Excel service initialization failed');
    }
  }

  async populateTaskDropdowns(tasks: Task[]): Promise<void> {
    try {
      await Excel.run(async (context: any) => {
        const sheet = context.workbook.worksheets.getActiveWorksheet();
        const taskRange = sheet.getRange('C5:C19');

        // Format tasks for dropdown
        const taskOptions = tasks.map(task => `${task.id} - ${task.name}`).join(',');

        // Apply data validation with dropdown list
        taskRange.dataValidation.clear();
        taskRange.dataValidation.rule = {
          list: {
            inCellDropDown: true,
            source: taskOptions
          }
        };

        // Apply formatting
        taskRange.format.fill.color = '#E5E7EB';
        taskRange.format.font.color = '#111827';

        await context.sync();
      });
    } catch (error) {
      console.error('Failed to populate task dropdowns:', error);
      throw error;
    }
  }

  async collectTimesheetData(): Promise<TimesheetEntryDto[]> {
    try {
      return await Excel.run(async (context: any) => {
        const sheet = context.workbook.worksheets.getActiveWorksheet();

        // Load required ranges
        const employeeRange = sheet.getRange('B3');
        const dateRange = sheet.getRange('A5:A9');
        const taskRange = sheet.getRange('C5:C9');
        const hoursRange = sheet.getRange('D5:D9');
        const notesRange = sheet.getRange('E5:E9');

        [employeeRange, dateRange, taskRange, hoursRange, notesRange].forEach(range => {
          range.load('values');
        });

        await context.sync();

        const entries: TimesheetEntryDto[] = [];
        const employeeName = employeeRange.values[0][0];

        for (let i = 0; i < 5; i++) {
          const taskCell = taskRange.values[i][0];
          const hours = hoursRange.values[i][0];

          if (!taskCell || !hours) continue;

          // Extract task ID from "123 - Task Name" format
          const taskId = parseInt(taskCell.split(' - ')[0], 10);
          if (isNaN(taskId)) continue;

          entries.push({
            taskId,
            employeeName,
            hoursWorked: parseFloat(hours),
            workDate: dateRange.values[i][0],
            notes: notesRange.values[i][0] || null
          });
        }

        return entries;
      });
    } catch (error) {
      console.error('Failed to collect timesheet data:', error);
      throw error;
    }
  }

  async updateSubmissionStatus(rows: number[], status: 'Submitted' | 'Failed'): Promise<void> {
    try {
      await Excel.run(async (context: any) => {
        const sheet = context.workbook.worksheets.getActiveWorksheet();

        rows.forEach(row => {
          const statusCell = sheet.getRange(`F${row}`);
          statusCell.values = [[status]];
          statusCell.format.font.color = status === 'Submitted' ? '#059669' : '#DC2626';
        });

        await context.sync();
      });
    } catch (error) {
      console.error('Failed to update submission status:', error);
      throw error;
    }
  }
}

export const excelService = ExcelService.getInstance();