import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
            toast.success(`Cron job pour ${selectedDb} créé avec succès !`);
        } catch (err) {
            console.error('Erreur lors de la requête:', err);
            toast.error('Échec de la création du cron job.');
        }
    };

    // handle cron job deletion
    const handleDeleteCron = async (taskName) => {
        try {
            console.log("Attempting to delete task:", taskName);
            const response = await fetch(`http://localhost:3000/cron/${taskName}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Erreur lors de la suppression du cron job');
            }
            const data = await response.json();
            console.log(data.message);
            setCrons(crons.filter(cron => cron.taskName !== taskName));
            toast.success(`Cron job pour ${taskName} supprimé avec succès !`);
        } catch (err) {
            console.error('Erreur lors de la requête:', err);
            toast.error('Échec de la suppression du cron job.');
        }
    };
    

    if (error) {
        return <div>Erreur: {error}</div>;
    }

    return (
        <div className="wrapper">
            <h1>Schedule Backup</h1>
            
            <div className="wrapper-result cron-result">
                <div className='cron-form'>
                <form onSubmit={handleCron}>
                    <h2>Set Up Cron</h2>
                    <div className='cron-select'>
                        <select
                            value={selectedDb}
                            onChange={(e) => setSelectedDb(e.target.value)}
                        >
                            <option value="">Select database</option>
                            {databases.map((db) => (
                                <option key={db.id} value={db.name}>
                                    {db.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedFrequency}
                            onChange={(e) => setSelectedFrequency(e.target.value)}
                            className='cron-select'
                        >
                            <option value="">Select cron format</option>
                            <option value="minute">Every Minute</option>
                            <option value="hour">Every Hour</option>
                            <option value="daily">Every Day at 7:00</option>
                        </select>
                    </div>
                    <button type="submit" className='cron-save-btn'>Save</button>
                </form>
                </div>

                <div className="cron-jobs-saved">
                    <h2>Cron Jobs saved</h2>
                    {crons.length === 0 ? (
                        <p>No cron jobs saved.</p>
                    ) : (
                        <ul>
                            {crons.map((cron) => (
                                <li key={cron.taskName}>
                                    {cron.taskName} - {cron.schedule}
                                    <button className='trash-icon' onClick={() => handleDeleteCron(cron.taskName)}>
                                        <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6.47619 0C5.4259 0 4.57143 0.841125 4.57143 1.875V3H0.761905C0.341333 3 0 3.336 0 3.75C0 4.164 0.341333 4.5 0.761905 4.5H1.56548L2.20685 15.8745C2.27465 17.2768 3.30976 18 4.57143 18H11.4286C12.6902 18 13.7253 17.2768 13.7932 15.8745L14.4345 4.5H15.2381C15.6587 4.5 16 4.164 16 3.75C16 3.336 15.6587 3 15.2381 3H11.4286V1.875C11.4286 0.841125 10.5741 0 9.52381 0H6.47619ZM6.57143 1.875H9.42857V3H6.57143V1.875ZM3.42857 5.25H12.5714L12.14 15H3.85714L3.42857 5.25Z" fill="#D0BCFF"/>
                                        </svg>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <ToastContainer 
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={true}
                  closeOnClick
                  pauseOnHover
                  draggable
                  theme="light"
            />
        </div>
    );
};