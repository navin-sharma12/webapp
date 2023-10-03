import fs from 'fs';
import path from 'path';
import db from "../config/dbSetup.js"

const currentDate = new Date();
const accountCreatedString = currentDate.toISOString();
const accountUpdatedString = currentDate.toISOString();

const initializeDatabase=async () => {
    try {
        // Sync the database to create tables if they don't exist
        await db.sequelize.sync({ create: true }); // Use alter: true to update existing schema

        // Load and insert data from CSV files
        const csvData = fs.readFileSync(path.join('/Users/navinsharma/Desktop/Uni Courses/Sem 3/Cloud/webapp/users.csv'), 'utf-8');
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
        console.log('Error bootstrapping the database:');
    }
}

export default initializeDatabase;