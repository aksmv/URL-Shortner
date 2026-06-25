import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import LinkDetail from './pages/LinkDetail';

export default function App() {
  const [selectedCode, setSelectedCode] = useState(null);

  return (
    <div className="app-shell">
      {selectedCode ? (
        <LinkDetail shortCode={selectedCode} onBack={() => setSelectedCode(null)} />
      ) : (
        <Dashboard onSelect={setSelectedCode} />
      )}
    </div>
  );
}
