import { useState } from 'react';
import { useReservation } from '../../context/ReservationContext';
import { createReservation } from '../../services/api';

function ReservationForm() {
  const { selectedDates, guestInfo, setGuestInfo } = useReservation();
  const [status, setStatus] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await createReservation({ ...selectedDates, ...guestInfo });
      setStatus('¡Reserva creada con éxito!');
    } catch {
      setStatus('Error al crear la reserva. Intenta de nuevo.');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre"
        value={guestInfo.name}
        onChange={e => setGuestInfo(prev => ({ ...prev, name: e.target.value }))}
      />
      <input
        type="email"
        placeholder="Correo electrónico"
        value={guestInfo.email}
        onChange={e => setGuestInfo(prev => ({ ...prev, email: e.target.value }))}
      />
      <button type="submit">Confirmar reserva</button>
      {status && <p>{status}</p>}
    </form>
  );
}

export default ReservationForm;
