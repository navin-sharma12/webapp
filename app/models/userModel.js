import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";

const userModel = (sequelize) => {
    let User = sequelize.define("user", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        emailid: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        account_created: {
            type: DataTypes.STRING,
            allowNull: false
        },
        account_updated: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
        {
            timestamps: false,
        },
        {
            initialAutoIncrement: 1,
        });

    // Define a hook on the User model to hash the password before saving
    User.beforeCreate((user) => {
        if(user.password) {
            user.password = bcrypt.hashSync(user.password, 12);
        }
    });

    return User;
}

export default userModel;
