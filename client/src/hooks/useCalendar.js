import { useState, useEffect, useRef } from 'react';
import { connectCalendar, disconnectCalendar } from '../services/calendarSocket';

export function useCalendar() {
  const [reservedDates, setReservedDates] = useState([]);
  const unmounted = useRef(false);

  useEffect(() => {
    unmounted.current = false;

    connectCalendar((message) => {
      if (unmounted.current) return;
      if (message.type === 'availability') {
        setReservedDates(message.dates);
      }
      if (message.type === 'reservation-created') {
        setReservedDates(prev => [...prev, message.reservation]);
      }
      if (message.type === 'reservation-cancelled') {
        setReservedDates(prev => prev.filter(r => r.id !== message.id));
      }
    }, () => unmounted.current);

    return () => {
      unmounted.current = true;
      disconnectCalendar();
    };
  }, []);

  return { reservedDates };
}
