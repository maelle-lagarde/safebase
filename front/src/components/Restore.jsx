import React, { useEffect, useState } from "react";
import '../assets/style/style.css';

export default function Restore () {
    const [restores, setRestores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRestores = async () => {
            try {
                const response = await fetch('http://localhost:3000/restores');
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des restores');
                }
                const data = await response.json();
                setRestores(data);
            } catch (err) {
                console.error('Erreur lors du fetch des restores:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRestores();
    }, []);

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (error) {
        return <div>Erreur: {error}</div>;
    }
    
    return (
        <div className="wrapper">
            <h1>Restore</h1>
            <div className="wrapper-result">
                <table>
                    <thead>
                        <tr>
                            <th>Path</th>
                            <th>Date</th>
                            <th>Database restored</th>
                        </tr>
                    </thead>
                    <tbody>
                        {restores.map((restore, index) => (
                            <tr key={index}>
                                <td>{restore.path}</td>
                                <td>{new Date(restore.date).toLocaleString()}</td>
                                <td>{restore.db_name_restored}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};