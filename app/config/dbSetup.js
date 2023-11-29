import assignmentModel from "../models/assignmentModel.js";
import userModel from "../models/userModel.js";
import submissionModel from "../models/submissionModel.js";
import { Sequelize } from 'sequelize';
import config from '../config/dbConfig.js';

const sequelize = new Sequelize(
    `${config.database.dialect}://${config.database.user}:${config.database.pd}@${config.database.host}/${config.database.database}`
);

let db = {}
db.sequelize = sequelize;

db.assignment = assignmentModel(sequelize);
db.user = userModel(sequelize);
db.submission = submissionModel(sequelize);

export default db;