import React from "react";
import '../style.css';

export default function Backup () {
    return (
        <div className="wrapper">
            <h1>Backup</h1>
            <div className="wrapper-result">
                <div className="select-db">
                    
                    <div className="select-1 backup-select">
                        <label for="databases">Database to save</label>
                        <select id="databases" name="databases">
                            <option value="mysql">database_1</option>
                            <option value="postgresql">database_2</option>
                            <option value="sqlite">database_3</option>
                            <option value="mongodb">database_4</option>
                        </select> 
                    </div>
                    
                    <div className="select-2 backup-select">
                        <label for="databases">Database to save</label>
                        <select id="databases" name="databases">
                            <option value="mysql">database_1</option>
                            <option value="postgresql">database_2</option>
                            <option value="sqlite">database_3</option>
                            <option value="mongodb">database_4</option>
                        </select> 
                    </div>
                </div>
            </div>
            <button id="add-db-btn">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 6.75H6.75V12H5.25V6.75H0V5.25H5.25V0H6.75V5.25H12V6.75Z" fill="#381E72"/>
                </svg>
                Run backup
            </button>
        </div>
    );
};