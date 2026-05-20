import { createContext, useContext, useState } from 'react';

const ReservationContext = createContext(null);

export function ReservationProvider({ children }) {
  const [selectedDates, setSelectedDates] = useState({ checkIn: null, checkOut: null });
  const [guestInfo, setGuestInfo]         = useState({ name: '', email: '' });

  return (
    <ReservationContext.Provider value={{ selectedDates, setSelectedDates, guestInfo, setGuestInfo }}>
      {children}
    </ReservationContext.Provider>
  );
}

export function useReservation() {
  return useContext(ReservationContext);
}
