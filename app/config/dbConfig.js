import env from 'dotenv';

env.config();

export default {
    database: {
        host: `${process.env.host}`,
        user: `${process.env.user}`,
        password: `${process.env.password}`,
        database: `${process.env.database}`,
        dialect: `${process.env.dialect}`,
        port: `${process.env.port}`,
    },
};