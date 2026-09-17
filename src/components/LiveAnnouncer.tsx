'use client';

import React, { createContext, useContext, useState } from 'react';

interface AnnouncerContextType {
  announce: (message: string, mode?: 'polite' | 'assertive') => void;
}

const AnnouncerContext = createContext<AnnouncerContextType>({
  announce: () => {},
});

export const LiveAnnouncerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [politeMessage, setPoliteMessage] = useState('');
  const [assertiveMessage, setAssertiveMessage] = useState('');

  const announce = (message: string, mode: 'polite' | 'assertive' = 'polite') => {
    if (mode === 'assertive') {
      setAssertiveMessage(message);
    } else {
      setPoliteMessage(message);
    }
  };

  return (
    <AnnouncerContext.Provider value={{ announce }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        data-testid="a11y-live-polite"
      >
        {politeMessage}
      </div>
      <div
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
        data-testid="a11y-live-assertive"
      >
        {assertiveMessage}
      </div>
    </AnnouncerContext.Provider>
  );
};

export const useLiveAnnouncer = () => useContext(AnnouncerContext);
