const cron = require('node-cron');
const Backup = require('./backup');

class Cron {
    constructor() {
        this.tasks = [];
        this.backupManager = new Backup();
    }

    // créé une tâche cron
    async createCronJob(frequency, taskName, dbId) {
        let schedule;

        switch (frequency) {
            case 'minute':
                schedule = '* * * * *'; // Toutes les minutes
                break;
            case 'hour':
                schedule = '0 * * * *'; // Chaque heure
                break;
            case 'daily':
                schedule = '0 7 * * *'; // Tous les jours à 7:00
                break;
            default:
                console.log(`Invalid frequency specified for task: ${taskName}`);
                return;
        }

        const task = cron.schedule(schedule, async () => {
            console.log(`Executing task: ${taskName}`);
            try {
                await this.backupManager.runBackup(dbId);
            } catch (error) {
                console.error(`Error running backup for task ${taskName}:`, error.message);
            }
        });

        this.tasks.push({ taskName, schedule, task });
        console.log(`Created task: ${taskName} with schedule: ${schedule}`);
        console.log("Current tasks:", this.tasks);
    }

    // affiche les tâches crons actives
    async showActiveCronJobs() {
        const activeJobs = this.tasks.map(({ taskName, schedule, dbId }) => ({
            taskName,
            schedule,
            dbId
        }));
    
        console.log("Active Cron Jobs:", activeJobs);
        return activeJobs;
    }

    // supprime une tâche cron
    async deleteCronJob(taskName) {
        console.log("Trying to delete task:", taskName); // Ajout du log
        const taskIndex = this.tasks.findIndex(t => t.taskName === taskName);
    
        if (taskIndex !== -1) {
            console.log("Found task:", this.tasks[taskIndex]); // Ajout du log
            this.tasks[taskIndex].task.stop();
            this.tasks.splice(taskIndex, 1);
            console.log(`Deleted task: ${taskName}`);
        } else {
            console.log(`Task not found: ${taskName}`);
        }
    };
}    

module.exports = Cron;