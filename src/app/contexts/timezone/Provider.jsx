import { createContext, useContext, useEffect, useState } from "react";

// Create Context
const TimezoneContext = createContext();

// Timezone Provider Component
export function TimezoneProvider({ children }){
    const [timezone, setTimezone] = useState("");

    useEffect(() => {
        const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setTimezone(detectedTimezone);
    }, []);

    return (
        <TimezoneContext.Provider value={{ timezone, setTimezone }}>
            {children}
        </TimezoneContext.Provider>
    );
};

export const useTimezone = () => useContext(TimezoneContext);