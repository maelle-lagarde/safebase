import React, { useEffect, useState } from 'react';
import AddDbModal from './AddDbModal';
import '../style.css';

export default function Databases() {
    const [databases, setDatabases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchDatabases = async () => {
          try {
            const response = await fetch('http://localhost:3000/databases');
            if (!response.ok) {
              throw new Error('Une erreur est survenue lors de la récupération des données');
            }
            const data = await response.json();
            setDatabases(data);
            setLoading(false);
          } catch (err) {
            console.error('Erreur lors de la requête:', err);
            setError(err.message);
            setLoading(false);
          }
        };
    
        fetchDatabases();
      }, []);

      const openModal = () => {
        setIsModalOpen(true);
      };

      const closeModal = () => {
        setIsModalOpen(false);
      };

      const deleteDb = async (dbId) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer cette base de données ?");
        if (!confirmation) return;

        try {
            const response = await fetch(`http://localhost:3000/database/delete/${dbId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la suppression de la base de données');
            }

            const result = await response.json();
            console.log(result.message);

            setDatabases((prevDatabases) => prevDatabases.filter((db) => db.id !== dbId));
        } catch (err) {
            console.error('Erreur lors de la suppression:', err.message);
        }
    };
    
      if (loading) {
        return <div>Chargement...</div>;
      }
    
      if (error) {
        return <div>Erreur: {error}</div>;
      }

    return (
        <div className="wrapper">
            <h1>Databases</h1>
            
            <div className="wrapper-result">
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>user</th>
                            <th>host</th>
                            <th>name</th>
                            <th>port</th>
                            <th>type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {databases.map((db, index) => (
                            <tr key={index}>
                            <td>{db.id}</td>
                            <td>{db.user}</td>
                            <td>{db.host}</td>
                            <td>{db.name}</td>
                            <td>{db.port}</td>
                            <td>{db.type}</td>
                            <td>
                              <button className='trash-icon'>
                                <svg onClick={() => deleteDb(db.id)} width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.47619 0C5.4259 0 4.57143 0.841125 4.57143 1.875V3H0.761905C0.341333 3 0 3.336 0 3.75C0 4.164 0.341333 4.5 0.761905 4.5H1.56548L2.20685 15.8745C2.27465 17.0663 3.27627 18 4.48884 18H11.5112C12.7234 18 13.7253 17.0663 13.7932 15.8745L14.4345 4.5H15.2381C15.6587 4.5 16 4.164 16 3.75C16 3.336 15.6587 3 15.2381 3H11.4286V1.875C11.4286 0.841125 10.5741 0 9.52381 0H6.47619ZM6.47619 1.5H9.52381C9.7341 1.5 9.90476 1.66838 9.90476 1.875V3H6.09524V1.875C6.09524 1.66838 6.2659 1.5 6.47619 1.5ZM3.09077 4.5H12.9092L12.2716 15.791C12.2491 16.1885 11.9154 16.5 11.5112 16.5H4.48884C4.08503 16.5 3.7509 16.1889 3.72842 15.7917L3.09077 4.5ZM8 6.09375C7.63162 6.09375 7.33333 6.38775 7.33333 6.75V14.25C7.33333 14.6123 7.63162 14.9062 8 14.9062C8.36838 14.9062 8.66667 14.6123 8.66667 14.25V6.75C8.66667 6.38775 8.36838 6.09375 8 6.09375ZM5.19717 6.09448C4.82955 6.10723 4.54174 6.41046 4.55432 6.77271L4.81994 14.3049C4.83251 14.6593 5.12853 14.9385 5.48586 14.9385C5.49386 14.9385 5.50167 14.9385 5.50967 14.9385C5.87729 14.9257 6.1651 14.6218 6.15253 14.2595L5.8869 6.72729C5.87395 6.36542 5.56441 6.08586 5.19717 6.09448ZM10.8021 6.09448C10.4337 6.08436 10.126 6.36542 10.1131 6.72729L9.84747 14.2595C9.83452 14.6218 10.1223 14.9257 10.4903 14.9385C10.4983 14.9389 10.5061 14.9385 10.5141 14.9385C10.8715 14.9385 11.1675 14.6593 11.1801 14.3049L11.4457 6.77271C11.4586 6.41046 11.1701 6.10723 10.8021 6.09448Z" fill="#D0BCFF"/>
                                </svg>
                              </button>
                            </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button id="add-db-btn" onClick={openModal}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 6.75H6.75V12H5.25V6.75H0V5.25H5.25V0H6.75V5.25H12V6.75Z" fill="#381E72"/>
                </svg>
                Add database
            </button>
            <AddDbModal isOpen={isModalOpen} onClose={closeModal} />
        </div>
    );
};