import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/Button';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import employeeService from '../../services/employeeService';
import { ROUTES } from '../../types/constants';
import { Attendance } from '../../types/employee';

const navItems = [
  { path: ROUTES.EMPLOYEE_DASHBOARD, label: 'Dashboard', icon: '📊' },
  { path: '/employee/projects', label: 'My Projects', icon: '🚀' },
  { path: '/employee/tasks', label: 'My Tasks', icon: '✅' },
  { path: '/employee/attendance', label: 'Attendance', icon: '📅' },
  { path: '/employee/leave', label: 'Leave', icon: '🏖️' },
  { path: '/employee/notifications', label: 'Notifications', icon: '🔔' },
  { path: '/employee/profile', label: 'Profile', icon: '👤' },
];

export default function EmployeeAttendance() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [records, setRecords] = useState<Attendance[]>([]);
  const [checkedIn, setCheckedIn] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  const loadAttendance = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getAttendance();
      setRecords(data);
      const todayRecord = data.find((r) => r.date === new Date().toISOString().split('T')[0]);
      setCheckedIn(!!(todayRecord && todayRecord.checkIn && !todayRecord.checkOut));
    } catch (err) {
      setError('Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAttendance(); }, []);

  const handleCheckIn = async () => {
    try {
      setActionLoading(true);
      setActionError('');
      await employeeService.checkIn();
      setCheckedIn(true);
      loadAttendance();
    } catch (err) {
      setActionError('Failed to check in');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setActionLoading(true);
      setActionError('');
      await employeeService.checkOut();
      setCheckedIn(false);
      loadAttendance();
    } catch (err) {
      setActionError('Failed to check out');
    } finally {
      setActionLoading(false);
    }
  };

  const totalPresent = records.filter((r) => r.status === 'present').length;
  const totalAbsent = records.filter((r) => r.status === 'absent').length;
  const totalLate = records.filter((r) => r.status === 'late').length;
  const avgHours = records.reduce((sum, r) => sum + r.workingHours, 0) / Math.max(records.length, 1);

  return (
    <DashboardLayout title="Attendance" navItems={navItems}>
      {error && <ErrorMessage message={error} className="mb-6" />}
      {actionError && <ErrorMessage message={actionError} className="mb-6" />}

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Attendance</h2>
        <p className="text-sm text-slate-500 mt-1">Track your daily attendance and working hours</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Present Days</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{totalPresent}</p>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Absent Days</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{totalAbsent}</p>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Late Days</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">{totalLate}</p>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Avg Hours/Day</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{avgHours.toFixed(1)}</p>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm mb-6">
        <h3 className="text-base font-semibold text-slate-900 mb-4">Today's Attendance</h3>
        <div className="flex flex-wrap items-center gap-4">
          {!checkedIn ? (
            <Button onClick={handleCheckIn} loading={actionLoading}>Check In</Button>
          ) : (
            <Button onClick={handleCheckOut} loading={actionLoading} variant="secondary">Check Out</Button>
          )}
          <span className="text-sm text-slate-500">
            {checkedIn ? 'You are currently checked in' : 'You are checked out for today'}
          </span>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900 mb-4">Attendance History</h3>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 px-3 font-medium text-slate-500">Date</th>
                  <th className="text-left py-2 px-3 font-medium text-slate-500">Check In</th>
                  <th className="text-left py-2 px-3 font-medium text-slate-500">Check Out</th>
                  <th className="text-left py-2 px-3 font-medium text-slate-500">Hours</th>
                  <th className="text-left py-2 px-3 font-medium text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((record) => (
                  <tr key={record.id}>
                    <td className="py-2.5 px-3 text-slate-900">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="py-2.5 px-3 text-slate-700">{record.checkIn || '-'}</td>
                    <td className="py-2.5 px-3 text-slate-700">{record.checkOut || '-'}</td>
                    <td className="py-2.5 px-3 text-slate-700">{record.workingHours > 0 ? `${record.workingHours}h` : '-'}</td>
                    <td className="py-2.5 px-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        record.status === 'present' ? 'bg-green-100 text-green-700' :
                        record.status === 'absent' ? 'bg-red-100 text-red-700' :
                        record.status === 'late' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                      }`}>{record.status.replace('_', ' ')}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
