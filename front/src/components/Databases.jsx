import React from "react";
import '../style.css';

export default function Databases ({ db_id, db_user, db_host, db_name, db_port }) {
    return (
        <div className="databases-page">
            <h1>Databases</h1>
            <div className="databases-list">
                <ul>
                    <li>id</li>
                    <li>user</li>
                    <li>host</li>
                    <li>name</li>
                    <li>port</li>
                </ul>
            </div>
            <div className="databases-result">
                <ul>
                    <li>{db_id}</li>
                    <li>{db_user}</li>
                    <li>{db_host}</li>
                    <li>{db_name}</li>
                    <li>{db_port}</li>
                </ul>
                {/* <ul>
                    <li>1</li>
                    <li>maelle</li>
                    <li>localhost</li>
                    <li>database_1</li>
                    <li>3342</li>
                </ul> */}
            </div>
            <button id="add-db-btn">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 6.75H6.75V12H5.25V6.75H0V5.25H5.25V0H6.75V5.25H12V6.75Z" fill="#381E72"/>
                </svg>
                Add databases
            </button>
        </div>
    );
};