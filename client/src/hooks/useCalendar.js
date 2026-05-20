import { useState, useEffect } from 'react';
import { connectCalendar, sendCalendarMessage, disconnectCalendar } from '../services/calendarSocket';

export function useCalendar() {
  const [reservedDates, setReservedDates] = useState([]);

  useEffect(() => {
    connectCalendar((message) => {
      if (message.type === 'availability') {
        setReservedDates(message.dates);
      }
      if (message.type === 'reservation-created') {
        setReservedDates(prev => [...prev, message.reservation]);
      }
      if (message.type === 'reservation-cancelled') {
        setReservedDates(prev => prev.filter(r => r.id !== message.id));
      }
    });
    return () => disconnectCalendar();
  }, []);

  return { reservedDates };
}
