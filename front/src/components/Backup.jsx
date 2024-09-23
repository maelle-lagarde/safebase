import React, { useEffect, useState } from "react";
import '../style.css';

export default function Backup() {
    const [backups, setBackups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBackups = async () => {
            try {
                const response = await fetch('http://localhost:3000/backups'); // Remplacez par l'URL appropriée
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
                            <th>Chemin</th>
                            <th>Date</th>
                            <th>Base de données sauvegardée</th>
                            <th>Base de données de destination</th>
                        </tr>
                    </thead>
                    <tbody>
                        {backups.map((backup, index) => (
                            <tr key={index}>
                                <td>{backup.path}</td>
                                <td>{new Date(backup.date).toLocaleString()}</td>
                                <td>{backup.db_name_saved}</td>
                                <td>{backup.db_name_destination}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
