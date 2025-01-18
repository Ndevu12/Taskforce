import React, { useState } from 'react';
import QuickStatistics from '../../components/Dashboard/QuickStatistics';
import { IReport, IReportSchedule } from '../../interfaces/Report';
import ReportTable from '../../components/Dashboard/ReportTable';
import ScheduleTable from '../../components/Dashboard/ScheduleTable';
import ReportDetailsModal from '../../components/Dashboard/ReportDetailsModal';
import ScheduleFormModal from '../../components/Dashboard/ScheduleFormModal';
import ConfirmDeleteModal from '../../components/Dashboard/ConfirmDeleteModal';
import { BudgetPeriod } from '../../interfaces/Budget';

const dummyReports: IReport[] = [
  {
    id: '1',
    schedule: BudgetPeriod.DAILY,
    status: 'Completed',
    data: { content: 'Report data 1' },
  },
  {
    id: '2',
    schedule: BudgetPeriod.WEEKLY,
    status: 'Failed',
    data: { content: 'Report data 2' },
  },
  {
    id: '3',
    schedule: BudgetPeriod.MONTHLY,
    status: 'Completed',
    data: { content: 'Report data 3' },
  },
];

const dummySchedules: IReportSchedule[] = [
  {
    id: '1',
    type: BudgetPeriod.DAILY,
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-01-31'),
  },
  {
    id: '2',
    type: BudgetPeriod.WEEKLY,
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-01-31'),
  },
  {
    id: '3',
    type: BudgetPeriod.MONTHLY,
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-01-31'),
  },
];

const Reports: React.FC = () => {
  const [reports] = useState<IReport[]>(dummyReports);
  const [schedules, setSchedules] = useState<IReportSchedule[]>(dummySchedules);
  const [selectedReport, setSelectedReport] = useState<IReport | null>(null);
  const [selectedSchedule, setSelectedSchedule] =
    useState<IReportSchedule | null>(null);
  const [isReportDetailsModalOpen, setIsReportDetailsModalOpen] =
    useState(false);
  const [isScheduleFormModalOpen, setIsScheduleFormModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);

  return (
    <div className="p-4 dark:bg-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Reports</h2>
        <button
          className="bg-blue-500 text-white p-2 rounded-lg"
          onClick={() => setIsScheduleFormModalOpen(true)}
        >
          Create Scheduled Report
        </button>
      </div>
      <QuickStatistics reports={reports} />
      <div className="flex justify-between items-center mt-7 mb-4">
        <h2 className="text-2xl font-bold">Auto-Generated Reports</h2>
      </div>
      <ReportTable
        reports={reports}
        onView={(report) => {
          setSelectedReport(report);
          setIsReportDetailsModalOpen(true);
        }}
        onDelete={(report) => {
          setSelectedReport(report);
          setIsConfirmDeleteModalOpen(true);
        }}
      />
      <h2 className="text-2xl font-bold mt-8">Scheduled Reports</h2>
      <ScheduleTable
        schedules={schedules}
        onView={(schedule) => {
          setSelectedSchedule(schedule);
          setIsScheduleFormModalOpen(true);
        }}
        onDelete={(schedule) => {
          setSelectedSchedule(schedule);
          setIsConfirmDeleteModalOpen(true);
        }}
      />
      {isReportDetailsModalOpen && selectedReport && (
        <ReportDetailsModal
          report={selectedReport}
          onClose={() => setIsReportDetailsModalOpen(false)}
        />
      )}
      {isScheduleFormModalOpen && (
        <ScheduleFormModal
          schedule={selectedSchedule}
          onClose={() => setIsScheduleFormModalOpen(false)}
          onSave={(newSchedule) => {
            setSchedules([...schedules, newSchedule]);
            setIsScheduleFormModalOpen(false);
          }}
        />
      )}
      {isConfirmDeleteModalOpen && (
        <ConfirmDeleteModal
          isOpen={isConfirmDeleteModalOpen}
          onConfirm={() => {
            setIsConfirmDeleteModalOpen(false);
          }}
          onCancel={() => setIsConfirmDeleteModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Reports;
