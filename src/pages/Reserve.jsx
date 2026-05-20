import AvailabilityCalendar from '../components/calendar/AvailabilityCalendar';
import ReservationForm      from '../components/calendar/ReservationForm';
import { useReservation }   from '../context/ReservationContext';

function Reserve() {
  const { setSelectedDates } = useReservation();

  return (
    <main>
      <h1>Reservar</h1>
      <AvailabilityCalendar onDateSelect={(date) => setSelectedDates(prev => ({ ...prev, checkIn: date }))} />
      <ReservationForm />
    </main>
  );
}

export default Reserve;
