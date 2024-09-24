import React, { useEffect, useState } from 'react';
import '../assets/style/style.css';

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  return (
    <div className="wrapper">
      <h1>welcome</h1>
      <div className='wrapper-result today'> 
        <div className='resume' id='nb-databses'>
          <h3>6 databases</h3>
          <p>ready to be use</p>   
        </div>
        <div className='resume' id='nb-backup'>
          <h3>6 backups</h3>
          <p>have been executed</p>
        </div>
        <div className='resume' id='nb-restore'>
          <h3>2 restorations</h3>
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

export default Connections;