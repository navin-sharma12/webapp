import assignmentModel from "../models/assignmentModel.js";
import userModel from "../models/userModel.js";
import { Sequelize } from 'sequelize';
import config from '../config/dbConfig.js';

const sequelize = new Sequelize(
    `${config.database.dialect}://${config.database.user}:${config.database.password}@${config.database.host}/${config.database.database}`
);

let db = {}
db.sequelize = sequelize;

db.assignment = assignmentModel(sequelize);
db.user = userModel(sequelize);

export default db;