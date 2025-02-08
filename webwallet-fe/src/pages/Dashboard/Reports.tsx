import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@mui/material';
import ReportTable from '../../components/Dashboard/Reports/ReportTable';
import ReportDetailsModal from '../../components/Dashboard/Reports/ReportDetailsModal';
import QuickStatistics from '../../components/Dashboard/Reports/QuickStatistics';
import ConfirmDeleteModal from '../../components/pop-ups/ConfirmDeleteModal';
import {
  fetchReports,
  fetchReportAnalytics,
  deleteReport,
  getReportDetails,
} from '../../actions/reportActions';
import {
  IReport,
  IReportSummary,
  IReportAnalytics,
} from '../../types/interfaces/Report';

const Reports: React.FC = () => {
  const [reports, setReports] = useState<IReportSummary[]>([]);
  const [analytics, setAnalytics] = useState<IReportAnalytics | null>(null);
  const [selectedReport, setSelectedReport] = useState<IReport | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch reports
      const reportsData = await fetchReports();
      if (typeof reportsData === 'string' && reportsData === 'Unauthorized') {
        navigate('/login');
        return;
      }

      setReports(
        Array.isArray(reportsData)
          ? reportsData.map((report) => ({
              ...report,
              summary: {
                transactionCount: 0,
                totalIncome: 0,
                totalExpense: 0,
                netAmount: 0,
              },
            }))
          : [],
      );

      // Fetch analytics
      setAnalyticsLoading(true);
      const analyticsData = await fetchReportAnalytics();
      if (
        typeof analyticsData === 'string' &&
        analyticsData === 'Unauthorized'
      ) {
        navigate('/login');
        return;
      }
      setAnalytics(analyticsData);
      setAnalyticsLoading(false);
    } catch (err: any) {
      setError(err.message || 'Error loading reports data');
      console.error('Error loading reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [navigate]);

  const handleViewReport = async (report: IReportSummary) => {
    try {
      setLoading(true);
      const reportDetails = await getReportDetails(report._id);
      if (
        typeof reportDetails === 'string' &&
        reportDetails === 'Unauthorized'
      ) {
        navigate('/login');
        return;
      }
      setSelectedReport(reportDetails as IReport);
    } catch (err: any) {
      setError(err.message || 'Failed to load report details');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReport = (reportId: string) => {
    setReportToDelete(reportId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!reportToDelete) return;

    try {
      setLoading(true);
      const result = await deleteReport(reportToDelete);
      if (result === 'Unauthorized') {
        navigate('/login');
        return;
      }

      // Refresh data after deletion
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to delete report');
    } finally {
      setLoading(false);
      setIsDeleteModalOpen(false);
      setReportToDelete(null);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Reports</h1>
      </div>

      {error && (
        <Alert severity="error" className="mb-4" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <QuickStatistics analytics={analytics} isLoading={analyticsLoading} />

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Your Reports</h2>
        <ReportTable
          reports={reports}
          onView={handleViewReport}
          onDelete={handleDeleteReport}
          isLoading={loading}
        />
      </div>

      {/* Report details modal */}
      {selectedReport && (
        <ReportDetailsModal
          report={selectedReport}
          onClose={() => {
            setSelectedReport(null);
          }}
        />
      )}

      {/* Confirm delete modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setReportToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this report? This action cannot be undone."
      />
    </div>
  );
};

export default Reports;
