import React, { useEffect, useState } from 'react';
import AddDbModal from './AddDbModal';
import BackupModal from './BackupModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/style/style.css';

export default function Databases() {
    const [databases, setDatabases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
    const [selectedDbId, setSelectedDbId] = useState(null);

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

      // Callback à exécuter après un ajout réussi
      const handleAddDbSuccess = () => {
        closeModal();
        toast.success("Base de données ajouté avec succès !");
        // Optionnel : tu peux ajouter ici du code pour mettre à jour la liste des backups si nécessaire
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
            toast.success("Base de données supprimée avec succès !");
        } catch (err) {
            console.error('Erreur lors de la suppression:', err.message);
            toast.error(`Erreur: ${err.message}`);
        }
    };

    const launchBackup = (dbId) => {
      setSelectedDbId(dbId);
      setIsBackupModalOpen(true);
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
                            <th>backup</th>
                            <th>delete</th>
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
                              <button className='dump-icon'>
                                <svg onClick={() => launchBackup(db.id)}  width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.25 16C3.79909 16 2.56136 15.4767 1.53682 14.43C0.512273 13.3767 0 12.0933 0 10.58C0 9.28 0.372273 8.12 1.11682 7.1C1.86773 6.08 2.84773 5.43 4.05682 5.15C4.45773 3.61667 5.25318 2.37667 6.44318 1.43C7.63955 0.476667 8.99182 0 10.5 0C12.3645 0 13.9427 0.68 15.2345 2.04C16.5327 3.39333 17.1818 5.04667 17.1818 7C18.2827 7.13333 19.1927 7.63333 19.9118 8.5C20.6373 9.35333 21 10.3533 21 11.5C21 12.7533 20.5832 13.8167 19.7495 14.69C18.9159 15.5633 17.9009 16 16.7045 16H11.4545C10.9327 16 10.4841 15.8033 10.1086 15.41C9.73318 15.0233 9.54545 14.5533 9.54545 14V8.85L8.01818 10.4L6.68182 9L10.5 5L14.3182 9L12.9818 10.4L11.4545 8.85V14H16.7045C17.3727 14 17.9359 13.7567 18.3941 13.27C18.8586 12.79 19.0909 12.2 19.0909 11.5C19.0909 10.8 18.8586 10.21 18.3941 9.73C17.9359 9.24333 17.3727 9 16.7045 9H15.2727V7C15.2727 5.62 14.8082 4.44 13.8791 3.46C12.95 2.48667 11.8236 2 10.5 2C9.18273 2 8.05636 2.48667 7.12091 3.46C6.19182 4.44 5.72727 5.62 5.72727 7H5.25C4.32727 7 3.54136 7.34333 2.89227 8.03C2.23682 8.71 1.90909 9.53333 1.90909 10.5C1.90909 11.4667 2.23682 12.3 2.89227 13C3.54136 13.6667 4.32727 14 5.25 14H7.63636V16" fill="#D0BCFF"/>
                                </svg>
                              </button>
                            </td>
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
            <AddDbModal
              isOpen={isModalOpen} 
              onClose={closeModal}
              onAdd={handleAddDbSuccess}
            />
            <BackupModal
              isOpen={isBackupModalOpen}
              onClose={() => setIsBackupModalOpen(false)}
              dbId={selectedDbId}
            />
            <ToastContainer 
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                draggable
                theme="light"
            />
        </div>
    );
};