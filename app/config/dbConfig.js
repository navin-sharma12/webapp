import env from 'dotenv';

env.config();

export default {
    database: {
        host: process.env.host,
        user: process.env.user,
        pd: process.env.pd,
        database: process.env.database,
        dialect: process.env.dialect,
        port: process.env.port,
        statsdhost: process.env.statsdhost,
        statsdPort: process.env.statsdPort,
        TopicArn: process.env.TopicArn,
    },
};