import React, { useEffect, useState } from 'react';
import { getConnections } from "../hooks/useFetchData";
import '../style.css';

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const result = await getConnections();
        setConnections(result);
      } catch (err) {
        setError('Erreur lors de la récupération des connexions');
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Liste des connexions</h1>
      <ul>
        {connections.map((connection) => (
          <li key={connection.id}>{connection.host}:{connection.port} - {connection.database}</li>
        ))}
      </ul>
    </div>
  );
};

export default Connections;