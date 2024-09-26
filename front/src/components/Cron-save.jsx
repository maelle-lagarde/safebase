import React, { useEffect, useState } from 'react';
import '../assets/style/style.css';

export default function Cron() {
    const [databases, setDatabases] = useState([]);
    const [error, setError] = useState(null);

    // Fetch databases
    useEffect(() => {
        const fetchDatabases = async () => {
            try {
                const response = await fetch('http://localhost:3000/databases');
                if (!response.ok) {
                    throw new Error('Une erreur est survenue lors de la récupération des données');
                }
                const data = await response.json();
                setDatabases(data);
            } catch (err) {
                console.error('Erreur lors de la requête:', err);
                setError(err.message);
            }
        };
        
        fetchDatabases();
    }, []);
};

    if (error) {
        return <div>Erreur: {error}</div>;
    }

    return (
        <div className="wrapper">
            <h1>Schedule Backup</h1>
            
            <div className="wrapper-result">

                <form onSubmit={handleCron} id='cron-form'>
                    <label>Select database</label>
                    <select
                        value={selectedDb}
                        onChange={(e) => setSelectedDb(e.target.value)}
                    >
                        <option value="">Select one</option>
                        {databases.map((db) => (
                            <option key={db.id} value={db.id}>
                                {db.name}
                            </option>
                        ))}
                    </select>

                    <label>Select cron format</label>
                    <select>
                        <option value="">Select one</option>
                        <option value="* * * * *">Every Minute</option>
                        <option value="0 * * * *">Every Hour</option>
                        <option value="0 7 * * *">Every Day at 7:00</option>
                    </select>

                    <button type="submit" className='modal-save-btn'>Save</button>
                </form>
                
            </div>

            <div className="cron-jobs">
                <h2>Cron Jobs Enregistrés</h2>
                {crons.length === 0 ? (
                    <p>Aucun cron job enregistré.</p>
                ) : (
                    <ul>
                        {crons.map((cron) => (
                            <li key={cron.id}>
                                
                                <button>
                                    Supprimer
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );