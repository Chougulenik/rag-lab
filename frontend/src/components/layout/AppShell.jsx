import React from 'react';
import Navbar from './Navbar';

export default function AppShell({ activeTab, onTabChange, systemStats, children }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Navbar activeTab={activeTab} onTabChange={onTabChange} systemStats={systemStats} />

      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '1440px',
          width: '100%',
          margin: '0 auto',
          padding: '1.5rem 2rem',
        }}
      >
        {children}
      </main>
    </div>
  );
}
