import React, { useEffect, useState } from "react";
import '../assets/style/style.css';

export default function Backup() {
    const [backups, setBackups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBackups = async () => {
            try {
                const response = await fetch('http://localhost:3000/backups');
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des backups');
                }
                const data = await response.json();
                setBackups(data);
            } catch (err) {
                console.error('Erreur lors du fetch des backups:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBackups();
    }, []);

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (error) {
        return <div>Erreur: {error}</div>;
    }

    return (
        <div className="wrapper">
            <h1>Backup</h1>
            <div className="wrapper-result">
                <table>
                    <thead>
                        <tr>
                            <th>Path</th>
                            <th>Date</th>
                            <th>Database saved</th>
                            <th>Database destination</th>
                            <th>Restore</th>
                        </tr>
                    </thead>
                    <tbody>
                        {backups.map((backup, index) => (
                            <tr key={index}>
                                <td>{backup.path}</td>
                                <td>{new Date(backup.date).toLocaleString()}</td>
                                <td>{backup.db_name_saved}</td>
                                <td>{backup.db_name_destination}</td>
                                <td>
                                    <button className='restore-icon'>
                                        <svg onClick={() => restoreDb(db.id)} width="19" height="21" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.11111 10.1769V7.15077C3.66278 8.04462 5.92167 8.61539 8.44444 8.61539C10.9672 8.61539 13.2261 8.04462 14.7778 7.15077V9.72462C14.9572 9.69231 15.1261 9.69231 15.3056 9.69231C15.8333 9.69231 16.3611 9.76769 16.8889 9.88616V4.30769C16.8889 1.92769 13.11 0 8.44444 0C3.77889 0 0 1.92769 0 4.30769V15.0769C0 17.4569 3.78944 19.3846 8.44444 19.3846C8.62389 19.3846 8.79278 19.3846 8.97222 19.3846C8.69778 18.7062 8.53944 17.9846 8.47611 17.2308H8.44444C4.35944 17.2308 2.11111 15.6154 2.11111 15.0769V12.6754C3.81056 13.5154 6.03778 14 8.44444 14C8.62389 14 8.80333 14 8.97222 14C9.34167 13.1169 9.85889 12.3415 10.5028 11.6954C9.83778 11.7923 9.15167 11.8462 8.44444 11.8462C5.89 11.8462 3.48333 11.2 2.11111 10.1769ZM8.44444 2.15385C12.5294 2.15385 14.7778 3.76923 14.7778 4.30769C14.7778 4.84615 12.5294 6.46154 8.44444 6.46154C4.35944 6.46154 2.11111 4.84615 2.11111 4.30769C2.11111 3.76923 4.35944 2.15385 8.44444 2.15385ZM14.7778 16.6923L16.6461 14.7862C16.1711 14.3015 15.5061 14 14.7778 14C13.3211 14 12.1389 15.2062 12.1389 16.6923C12.1389 18.1785 13.3211 19.3846 14.7778 19.3846C15.6433 19.3846 16.4033 18.9646 16.8889 18.3077H18.6939C18.0711 19.8908 16.5511 21 14.7778 21C12.445 21 10.5556 19.0723 10.5556 16.6923C10.5556 14.3123 12.445 12.3846 14.7778 12.3846C15.9494 12.3846 17.005 12.8692 17.765 13.6446L19 12.3846V16.6923H14.7778Z" fill="#D0BCFF"/>
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
