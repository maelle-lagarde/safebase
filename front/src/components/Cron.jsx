import React, { useEffect, useState } from 'react';
import '../assets/style/style.css';

export default function Cron() {
    const [databases, setDatabases] = useState([]);
    const [error, setError] = useState(null);
    const [selectedDb, setSelectedDb] = useState('');
    const [selectedFrequency, setSelectedFrequency] = useState('');
    const [crons, setCrons] = useState([]);

    // fetch databases
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

    // fetch active cron jobs
    useEffect(() => {
        const fetchCrons = async () => {
            try {
                const response = await fetch('http://localhost:3000/cron');
                if (!response.ok) {
                    throw new Error('Une erreur est survenue lors de la récupération des cron jobs');
                }
                const data = await response.json();
                setCrons(data);
            } catch (err) {
                console.error('Erreur lors de la requête:', err);
                setError(err.message);
            }
        };

        fetchCrons();
    }, []);

    // handle cron job
    const handleCron = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/cron', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ frequency: selectedFrequency, taskName: selectedDb }),
            });
            if (!response.ok) {
                throw new Error('Erreur lors de la création du cron job');
            }
            const data = await response.json();
            console.log(data.message);
            setCrons([...crons, { taskName: selectedDb, schedule: selectedFrequency }]);
        } catch (err) {
            console.error('Erreur lors de la requête:', err);
            setError(err.message);
        }
    };

    // handle cron job deletion
    const handleDeleteCron = async (taskName) => {
        try {
            console.log("Attempting to delete task:", taskName); // Log du taskName
            const response = await fetch(`http://localhost:3000/cron/${taskName}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Erreur lors de la suppression du cron job');
            }
            const data = await response.json();
            console.log(data.message);
            setCrons(crons.filter(cron => cron.taskName !== taskName));
        } catch (err) {
            console.error('Erreur lors de la requête:', err);
            setError(err.message);
        }
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
                            <option key={db.id} value={db.name}>
                                {db.name}
                            </option>
                        ))}
                    </select>

                    <label>Select cron format</label>
                    <select
                        value={selectedFrequency}
                        onChange={(e) => setSelectedFrequency(e.target.value)}
                    >
                        <option value="">Select one</option>
                        <option value="minute">Every Minute</option>
                        <option value="hour">Every Hour</option>
                        <option value="daily">Every Day at 7:00</option>
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
                            <li key={cron.taskName}>
                                {cron.taskName} - {cron.schedule}
                                <button onClick={() => handleDeleteCron(cron.taskName)}>Supprimer</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};