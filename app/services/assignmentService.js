import bcrypt from "bcrypt";
import db from "../config/dbSetup.js";

//add a new assignment
export const addAssignment = async (newDetails) => {
    try {
        await db.sequelize.sync({ alter: true });
        const assignment = await db.assignment.create(newDetails);
        return assignment;
    } catch (error) {
        console.error("Error creating assignment:");
        throw error;
    }
}

//delete a assignment
export const removeAssignment = async (id) => {
    return db.assignment.destroy({
        where: { id },
    });
}

//get all athe assignments
export const getAllAssignments = async () => {
    try {
        const assignments = await db.assignment.findAll();
        return assignments;
    } catch (error) {
        return null;
    }
}

//get all athe assignments
export const getAssignmentById = async (id) => {
    try {
        const assignments = await db.assignment.findOne({
            where: { id: id },
        });
        return assignments;
    } catch (error) {
        throw null;
    }
}

//update the assignments
export const updateAssignment = async (updatedDetails, id) => {
    const { name, points, num_of_attempts, deadline, assignment_updated } = updatedDetails;
    return db.assignment.update(
        { name, points, num_of_attempts, deadline, assignment_updated },
        { where: { id: id } }
    );
}

//authenticate the user
export const authenticate = async (email, password) => {
    const user = await db.user.findOne({ where: { emailid: email } });
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return null;
    } else {
        return user.id;
    }
}

//health check
export const healthCheck = async () => {
    try {
        await db.sequelize.authenticate();
        return true;
    } catch (error) {
        return false;
    }
}

//add a new submission
export const addSubmission = async (newDetails) => {
    try {
        await db.sequelize.sync({ alter: true });
        const submission = await db.submission.create(newDetails);
        return submission;
    } catch (error) {
        console.error("Error submitting the assignment:");
        throw error;
    }
}

//get all the submissions
export const getSubmissionById = async (user_id, assignment_id) => {
    try {
        const submission = await db.submission.findAll({
            where: { user_id: user_id, assignment_id: assignment_id },
        });
        return submission;
    } catch (error) {
        throw null;
    }
}