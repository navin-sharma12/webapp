import { DataTypes } from "sequelize";

const submissionModel = (sequelize) => {
    let Submission = sequelize.define("submission", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.UUID,
        },
        assignment_id: {
            type: DataTypes.UUID,
        },
        submission_url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        submission_date: {
            type: DataTypes.STRING,
            allowNull: false
        },
        assignment_updated: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
        {
            timestamps: false,
        });

    return Submission;
}

export default submissionModel;
