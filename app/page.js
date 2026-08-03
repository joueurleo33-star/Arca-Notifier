'use client';

import { useState, useEffect } from 'react';

export default function HomePage() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('https://raw.githack.com/joueurleo33-star/Arca-Notifier/main/animals_logs.json');
        if (res.ok) {
          const data = await res.json();
          setLogs(data);
        }
      } catch (error) {
        console.error('Erreur de récupération:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="header">🐾 ARCA NOTIFIER - LOGS (Next.js)</div>
      
      {isLoading ? (
        <div className="waiting">Chargement des logs...</div>
      ) : logs.length === 0 ? (
        <div className="waiting">En attente d'animaux...</div>
      ) : (
        <div>
          {logs.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>
      )}
    </div>
  );
}
