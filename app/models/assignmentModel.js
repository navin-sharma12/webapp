import { DataTypes } from "sequelize";

const assignmentModel = (sequelize) => {
    let Assignment = sequelize.define('assignment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
        },
        name: {
            type: DataTypes.STRING,
        },
        points: {
            type: DataTypes.INTEGER,
            validate: {
                min: 1,
                max: 10,
            },
        },
        num_of_attempts: {
            type: DataTypes.INTEGER,
            validate: {
                min: 1,
                max: 100,
            },
        },
        deadline: {
            type: DataTypes.STRING,
        },
        assignment_created: {
            type: DataTypes.STRING,
        },
        assignment_updated: {
            type: DataTypes.STRING,
        }
    },
        {
            timestamps: false,
        },
        {
            initialAutoIncrement: 1,
        });
    return Assignment;
}

export default assignmentModel;