import React, { useEffect, useState } from 'react';

export default function RestoreModal({ isOpen, onClose, onRestore, backupId }) {
    const [databases, setDatabases] = useState([]);
    const [selectedDestinationDb, setSelectedDestinationDb] = useState('');

    useEffect(() => {
        const fetchDatabases = async () => {
            try {
                const response = await fetch('http://localhost:3000/databases');
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des bases de données');
                }
                const databasesData = await response.json();
                setDatabases(databasesData);
            } catch (error) {
                console.error('Erreur lors du fetch des bases de données:', error);
            }
        };

        if (isOpen) {
            fetchDatabases();
        }
    }, [isOpen]);

    const handleRestore = async () => {
        if (selectedDestinationDb) {
            try {
                const response = await fetch(`http://localhost:3000/restore/${backupId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ destinationDbId: selectedDestinationDb }),
                });

                if (!response.ok) {
                    throw new Error('Échec lors de la restauration');
                }

                const result = await response.json();
                console.log(result.message);

                onClose();
                onRestore();
            } catch (error) {
                console.error('Erreur lors de la restauration:', error);
            }
        }
    };

    if (!isOpen) return null; 

    return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <h2>Restore</h2>
                    <div className='restore-select'>
                        <label>Select a database destination :</label>
                        <select
                            value={selectedDestinationDb}
                            onChange={(e) => setSelectedDestinationDb(e.target.value)}
                        >
                            <option value="">Select one</option>
                            {databases.map((db) => (
                                <option key={db.id} value={db.id}>
                                    {db.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={{ marginTop: "20px" }}>
                        <button className="modal-save-btn" onClick={handleRestore}>Restore</button>
                        <button className="modal-cancel-btn" style={{ marginLeft: "10px" }} onClick={onClose}>Cancel</button>
                    </div>
                </div>
            </div>
        )
}
