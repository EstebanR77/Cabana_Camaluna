import Calendar from 'react-calendar';
import { useCalendar } from '../../hooks/useCalendar';

function AvailabilityCalendar({ onDateSelect }) {
  const { reservedDates } = useCalendar();

  function tileDisabled({ date }) {
    // Deshabilitar fechas ya reservadas
    return reservedDates.some(r => {
      const checkIn  = new Date(r.checkIn);
      const checkOut = new Date(r.checkOut);
      return date >= checkIn && date <= checkOut;
    });
  }

  return (
    <Calendar
      onClickDay={onDateSelect}
      tileDisabled={tileDisabled}
      minDate={new Date()}
    />
  );
}

export default AvailabilityCalendar;
