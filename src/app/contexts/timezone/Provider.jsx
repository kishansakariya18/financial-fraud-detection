import { useEffect, useState } from 'react';
import TimezoneContext from './context';

// Timezone Provider Component
export function TimezoneProvider({ children }) {
  const [timezone, setTimezone] = useState('');

  useEffect(() => {
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(detectedTimezone);
  }, []);

  return (
    <TimezoneContext.Provider value={{ timezone, setTimezone }}>
      {children}
    </TimezoneContext.Provider>
  );
}
