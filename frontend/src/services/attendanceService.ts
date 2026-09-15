import api from './api';

export interface AttendanceRecord {
  id: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'half_day' | 'leave';
}

export const attendanceService = {
  getDailyAttendance: async (date: string) => {
    return api.get(`/attendance/daily?date=${date}`);
  },
  recordCheckIn: async () => {
    return api.post('/attendance/checkin');
  },
  recordCheckOut: async () => {
    return api.post('/attendance/checkout');
  }
};
