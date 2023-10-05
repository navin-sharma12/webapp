import fs from 'fs';
import path from 'path';
import db from "../config/dbSetup.js"

const currentDate = new Date();
const accountCreatedString = currentDate.toISOString();
const accountUpdatedString = currentDate.toISOString();

const initializeDatabase=async () => {
    try {
        // Sync the database to create tables if they don't exist
        await db.sequelize.sync({ alter: true }); // Use alter: true to update existing schema

        // Load and insert data from CSV files
        const csvData = fs.readFileSync(path.join('/root/opt/webapp/users.csv'), 'utf-8');
        const rows = csvData.split('\n').map((row) => row.split(','));

        for (let i = 1; i < rows.length; i++) {
            const [first_name, last_name, emailid, password] = rows[i];
            await db.user.create({
                first_name,
                last_name,
                emailid,
                password,
                account_created: accountCreatedString,
                account_updated: accountUpdatedString
            });
        }

        console.log('Database bootstrapped successfully.');
    } catch (error) {
        console.log('');
    }
}

export default initializeDatabase;