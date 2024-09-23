import React, { useEffect, useState } from 'react';

export default function BackupModal({ isOpen, onClose, onBackup }) {
    const [databases, setDatabases] = useState([]);
    const [selectedSourceDb, setSelectedSourceDb] = useState('');
    const [selectedDestinationDb, setSelectedDestinationDb] = useState('');

    useEffect(() => {
        const fetchDatabases = async () => {
            try {
                const response = await fetch('http://localhost:3000/databases');
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des bases de données');
                }
                const data = await response.json();
                setDatabases(data);
            } catch (error) {
                console.error('Erreur lors du fetch des bases de données:', error);
            }
        };

        if (isOpen) {
            fetchDatabases();
        }
    }, [isOpen]);

    const handleBackup = async () => {
        if (selectedSourceDb && selectedDestinationDb) {
            try {
                const response = await fetch(`http://localhost:3000/backup/${selectedSourceDb}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ destinationDbName: selectedDestinationDb }),
                });

                if (!response.ok) {
                    throw new Error('Échec lors de la demande de backup');
                }

                const result = await response.json();
                console.log(result.message);
                onClose();
            } catch (error) {
                console.error('Erreur lors du backup:', error);
                alert('Une erreur est survenue lors du backup. Veuillez réessayer.');
            }
        } else {
            alert('Veuillez sélectionner une base de données source et une base de données de destination.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Lancer le Backup</h2>
                <div>
                    <label>Base de données à sauvegarder:</label>
                    <select value={selectedSourceDb} onChange={(e) => setSelectedSourceDb(e.target.value)}>
                        <option value="">Sélectionnez une base de données</option>
                        {databases.map((db) => (
                            <option key={db.id} value={db.id}>{db.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Base de données de destination:</label>
                    <select value={selectedDestinationDb} onChange={(e) => setSelectedDestinationDb(e.target.value)}>
                        <option value="">Sélectionnez une base de données</option>
                        {databases.map((db) => (
                            <option key={db.id} value={db.name}>{db.name}</option>
                        ))}
                    </select>
                </div>
                <div className="modal-buttons">
                    <button onClick={handleBackup}>Confirmer</button>
                    <button onClick={onClose}>Annuler</button>
                </div>
            </div>
        </div>
    );
}