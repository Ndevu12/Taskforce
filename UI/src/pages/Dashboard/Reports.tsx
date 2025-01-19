import React, { useState, useEffect } from 'react';
import { IReport, IReportSchedule } from '../../interfaces/Report';
import ReportTable from '../../components/Dashboard/Reports/ReportTable';
import ScheduleTable from '../../components/Dashboard/Reports/ScheduleTable';
import ReportDetailsModal from '../../components/Dashboard/Reports/ReportDetailsModal';
import ScheduleFormModal from '../../components/Dashboard/Reports/ScheduleFormModal';
import ConfirmDeleteModal from '../../components/pop-ups/ConfirmDeleteModal';
import QuickStatistics from '../../components/Dashboard/Reports/QuickStatistics';
import {
  fetchReports,
  fetchSchedules,
  ScheduleReport,
  updateSchedule,
  deleteSchedule,
} from '../../actions/reportActions';

const Reports: React.FC = () => {
  const [reports, setReports] = useState<IReport[]>([]);
  const [schedules, setSchedules] = useState<IReportSchedule[]>([]);
  const [selectedReport, setSelectedReport] = useState<IReport | null>(null);
  const [selectedSchedule, setSelectedSchedule] =
    useState<IReportSchedule | null>(null);
  const [isReportDetailsModalOpen, setIsReportDetailsModalOpen] =
    useState(false);
  const [isScheduleFormModalOpen, setIsScheduleFormModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await fetchReports();
        setReports(data);
      } catch (err) {
        console.error('Failed to load reports');
      }
    };

    const loadSchedules = async () => {
      try {
        const data = await fetchSchedules();
        const filteredSchedules = data.filter(
          (schedule) => schedule.type !== 'EXCEEDED',
        );
        setSchedules(filteredSchedules);
      } catch (err) {
        console.error('Failed to load schedules');
      }
    };

    loadReports();
    loadSchedules();
  }, []);

  const handleSaveSchedule = async (schedule: IReportSchedule) => {
    try {
      if (schedule.id) {
        await updateSchedule(schedule);
      } else {
        await ScheduleReport(schedule);
      }
      const updatedSchedules = await fetchSchedules();
      const filteredSchedules = updatedSchedules.filter(
        (schedule) => schedule.type !== 'EXCEEDED',
      );
      setSchedules(filteredSchedules);
    } catch (err) {
      console.error('Failed to save schedule');
    }
  };

  const handleDeleteSchedule = async () => {
    if (selectedSchedule) {
      try {
        await deleteSchedule(selectedSchedule.id);
        const updatedSchedules = await fetchSchedules();
        const filteredSchedules = updatedSchedules.filter(
          (schedule) => schedule.type !== 'EXCEEDED',
        );
        setSchedules(filteredSchedules);
        setIsConfirmDeleteModalOpen(false);
      } catch (err) {
        console.error('Failed to delete schedule');
      }
    }
  };

  return (
    <div className="p-4 dark:bg-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Reports</h2>
        <button
          className="bg-blue-500 text-white p-2 rounded-lg"
          onClick={() => setIsScheduleFormModalOpen(true)}
        >
          Schedule new Reporting time
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
          onSave={handleSaveSchedule}
        />
      )}
      {isConfirmDeleteModalOpen && (
        <ConfirmDeleteModal
          isOpen={isConfirmDeleteModalOpen}
          onConfirm={handleDeleteSchedule}
          onCancel={() => setIsConfirmDeleteModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Reports;
