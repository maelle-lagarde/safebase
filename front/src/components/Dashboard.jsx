import React, { useEffect, useState } from 'react';
import '../assets/style/style.css';

export default function Dashboard() {
    const [stats, setStats] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('http://localhost:3000/stats');
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des statistiques');
                }
                const data = await response.json();
                setStats(data);
            } catch (err) {
                console.error('Erreur lors du fetch des statistiques:', err);
                setError(err.message);
            }
        };

        fetchStats();
    }, []);

    if (error) {
        return <div>Erreur: {error}</div>;
    }

    return (
        <div className="wrapper">
            <h1>Welcome</h1>
            <div className='wrapper-result today'> 
                <div className='resume' id='nb-databases'>
                    <p className='nb-stat'>{stats.databases}</p>
                    <h3>databases</h3>
                    <p>ready to be used</p>   
                </div>
                <div className='resume' id='nb-backup'>
                    <p className='nb-stat'>{stats.backups}</p>
                    <h3>backups</h3>
                    <p>have been executed</p>
                </div>
                <div className='resume' id='nb-restore'>
                    <p className='nb-stat'>{stats.restores}</p>
                    <h3>restorations</h3>
                    <p>have been executed</p>
                </div>
            </div>
            <div className='wrapper-result today last'>  
                <div className='resume' id='db-run'>
                    <h3>database_3</h3>
                    <p>currently running</p>
                </div>
                <div className='resume' id='nb-cron'>
                    <h3>backup every 2 hours</h3>
                    <p>have been programmed</p>  
                </div>
            </div>
        </div>
    );
};