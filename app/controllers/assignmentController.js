import { authenticate, addAssignment, removeAssignment, getAllAssignments, getAssignmentById, updateAssignment, healthCheck } from "../services/assignmentService.js";
import db from "../config/dbSetup.js";

//Create assignment
export const post = async (request, response) => {

    const health = await healthCheck();
    if (health !== true) {
        return response.status(503).header('Cache-Control', 'no-cache, no-store, must-revalidate').send('');
    }

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return response.status(401).send('');
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');

    const authenticated = await authenticate(email, password);

    if (authenticated === null) {
        return response.status(401).send('');
    }

    try {
        let newDetails = request.body;
        newDetails.user_id = authenticated;
        newDetails.assignment_created = new Date().toISOString();
        newDetails.assignment_updated = new Date().toISOString();
        if (
            bodyKeys.some(
                (bodyVal) =>
                    ![
                        "name",
                        "points",
                        "num_of_attempts",
                        "deadline",
                    ].includes(bodyVal)
            )
        ) {
            response.status(400).send("");
        } else {
            const savedDetails = await addAssignment(newDetails);
            return response.status(201).send('');
        }
    } catch (error) {
        return response.status(400).send('');
    }
};

//get all the assignments
export const getAssignments = async (request, response) => {

    const health = await healthCheck();
    if (health !== true) {
        return response.status(503).header('Cache-Control', 'no-cache, no-store, must-revalidate').send('');
    }

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return response.status(401).send('');
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');

    const authenticated = await authenticate(email, password);

    if (authenticated === null) {
        return response.status(401).send('');
    }

    try {
        const assignments = await getAllAssignments(authenticated);

        if (assignments.length === 0) {
            // Handle the case when no assignments are found for the user
            return response.status(404).send('');
        } else {
            // Send the assignments as a JSON response
            return response.status(200).send(assignments);
        }
    } catch (error) {
        return response.status(400).send('');
    }

}

//get assignment by Id
export const getAssignmentUsingId = async (request, response) => {

    const health = await healthCheck();
    if (health !== true) {
        return response.status(503).header('Cache-Control', 'no-cache, no-store, must-revalidate').send('');
    }

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return response.status(401).send('');
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');

    const authenticated = await authenticate(email, password);

    if (authenticated === null) {
        return response.status(401).send('');
    }

    // const assignment = await db.assignment.findOne({ where: { id: request.params.id } });
    // if (assignment.user_id != authenticated) {
    //     return response.status(401).send('');
    // }

    try {
        const id = request.params.id;
        const assignments = await getAssignmentById(authenticated, id);

        if (assignments.length === 0) {
            // Handle the case when no assignments are found for the user
            return response.status(404).send('');
        } else {
            // Send the assignments as a JSON response
            return response.status(200).send(assignments);
        }
    } catch (error) {
        return response.status(400).send('');
    }

}

//update assignment
export const updatedAssignment = async (request, response) => {

    const health = await healthCheck();
    if (health !== true) {
        return response.status(503).header('Cache-Control', 'no-cache, no-store, must-revalidate').send('');
    }

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return response.status(401).send('');
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');

    const authenticated = await authenticate(email, password);

    if (authenticated === null) {
        return response.status(401).send('');
    }

    const assignment = await db.assignment.findOne({ where: { id: request.params.id } });
    if (assignment.user_id != authenticated) {
        return response.status(403).send('');
    }

    try {
        const id = request.params.id;
        let newDetails = request.body;
        newDetails.assignment_updated = new Date().toISOString();
        const updatedDetails = await updateAssignment(newDetails, id);
        return response.status(200).send('');
    } catch (error) {
        return response.status(400).send('');
    }
};

//remove the assignment
export const remove = async (request, response) => {

    const health = await healthCheck();
    if (health !== true) {
        return response.status(503).header('Cache-Control', 'no-cache, no-store, must-revalidate').send('');
    }

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return response.status(401).send('');
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');

    const authenticated = await authenticate(email, password);

    if (authenticated === null) {
        return response.status(401).send('');
    }

    const assignment = await db.assignment.findOne({ where: { id: request.params.id } });
    if (assignment.user_id != authenticated) {
        return response.status(403).send('');
    }

    try {
        const id = request.params.id;
        await removeAssignment(id);
        return response.status(200).send('');
    } catch (error) {
        return response.status(400).send('');
    }
};

//healthz check for assignment
export const healthz = async (request, response) => {
    if (request.method !== 'GET') {
        return response.status(405).send('');
    } else if (request.headers['content-length'] > 0) {
        return response.status(400).send('');
    } else if (request.query && Object.keys(request.query).length > 0) {
        return response.status(400).send('');
    } else {
        try {
            const health = await healthCheck();
            if (health === true) {
                return response.status(200).header('Cache-Control', 'no-cache, no-store, must-revalidate').send('');
            } else {
                return response.status(503).header('Cache-Control', 'no-cache, no-store, must-revalidate').send('');
            }
        } catch (error) {
            return response.status(503).header('Cache-Control', 'no-cache, no-store, must-revalidate').send('');
        }
    }
}