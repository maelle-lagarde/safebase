const API_URL = 'http://localhost:3000';  

// Récupérer toutes les connexions
export const getConnections = async () => {
  const response = await fetch(`${API_URL}/dashboard`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des connexions');
  }
  return await response.json();
};

// Créer une nouvelle connexion
export const createConnection = async (connectionData) => {
  const response = await fetch(`${API_URL}/dashboard`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(connectionData),
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la création de la connexion');
  }
  return await response.json();
};

// Lancer une sauvegarde
export const launchBackup = async (databaseName) => {
  const response = await fetch(`${API_URL}/backup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ database: databaseName }),
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la sauvegarde');
  }
  return await response.json();
};