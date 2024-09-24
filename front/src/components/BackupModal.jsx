import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function BackupModal({ isOpen, onClose }) {
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
                toast.error("Erreur lors de la récupération des bases de données.");
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
                toast.success("Backup réussi !");
                onClose(); // Fermez la modale après une sauvegarde réussie
            } catch (error) {
                console.error('Erreur lors du backup:', error);
                toast.error(`Erreur lors du backup: ${error.message}`);
            }
        } else {
            toast.warn('Veuillez sélectionner une base de données source et une base de données de destination.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Run Backup</h2>
                <div className='db-save'>
                    <label>Database to save</label>
                    <select value={selectedSourceDb} onChange={(e) => setSelectedSourceDb(e.target.value)}>
                        <option value="">Select one</option>
                        {databases.map((db) => (
                            <option key={db.id} value={db.id}>{db.name}</option>
                        ))}
                    </select>
                </div>
                <div className='db-destination'>
                    <label>Database destination</label>
                    <select value={selectedDestinationDb} onChange={(e) => setSelectedDestinationDb(e.target.value)}>
                        <option value="">Select one</option>
                        {databases.map((db) => (
                            <option key={db.id} value={db.name}>{db.name}</option>
                        ))}
                    </select>
                </div>
                <div style={{ marginTop: "20px" }}>
                    <button className="modal-save-btn" onClick={handleBackup}>Run</button>
                    <button className="modal-cancel-btn" style={{ marginLeft: "10px" }} onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}
