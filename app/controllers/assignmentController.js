import { authenticate, addAssignment, removeAssignment, getAllAssignments, getAssignmentById, updateAssignment, healthCheck } from "../services/assignmentService.js";
import db from "../config/dbSetup.js";
import StatsD from "node-statsd";
import appLogger from "../config/logger.js";
const statsd = new StatsD({ host: "127.0.0.1", port: 8125 });

//Create assignment
export const post = async (request, response) => {

    statsd.increment("endpoint.post.assignment");

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

    const bodyKeys = Object.keys(request.body);

    const requiredKeys = [
        "name",
        "points",
        "num_of_attempts",
        "deadline",
    ];

    const optionalKeys = [
        "assignment_created",
        "assignment_updated",
    ];

    // Check if all required keys are present
    const missingKeys = requiredKeys.filter(key => !bodyKeys.includes(key));

    if (missingKeys.length > 0) {
        return response.status(400).send("Missing required keys: " + missingKeys.join(", "));
    }

    // Check if there are any additional keys in the payload
    const extraKeys = bodyKeys.filter(key => !requiredKeys.includes(key) && !optionalKeys.includes(key));

    if (extraKeys.length > 0) {
        return response.status(400).send("Invalid keys in the payload: " + extraKeys.join(", "));
    }

    try {
        let newDetails = request.body;
        newDetails.user_id = authenticated;
        newDetails.assignment_created = new Date().toISOString();
        newDetails.assignment_updated = new Date().toISOString();
        const savedDetails = await addAssignment(newDetails);
        appLogger.info("Post successfull.");
        return response.status(201).send('');
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
        } if (request.body && Object.keys(request.body).length > 0) {
            return response.status(400).send();
        }
        else {
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

    const assignment = await db.assignment.findOne({
        where: { id: request.params.id },
    });
    if (!assignment) {
        return response.status(204).send("");
    }

    try {
        const id = request.params.id;
        const assignments = await getAssignmentById(authenticated, id);

        if (assignments.length === 0) {
            return response.status(200).send('');
        } if (request.body && Object.keys(request.body).length > 0) {
            return response.status(400).send();
        } else {
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
    if(!assignment) return response.status(404).send('');

    if (assignment.user_id != authenticated) {
        return response.status(403).send('');
    }

    const bodyKeys = Object.keys(request.body);

    const requiredKeys = [
        "name",
        "points",
        "num_of_attempts",
        "deadline",
    ];

    const optionalKeys = [
        "assignment_created",
        "assignment_updated",
    ];

    // Check if all required keys are present
    const missingKeys = requiredKeys.filter(key => !bodyKeys.includes(key));

    if (missingKeys.length > 0) {
        return response.status(400).send("Missing required keys: " + missingKeys.join(", "));
    }

    // Check if there are any additional keys in the payload
    const extraKeys = bodyKeys.filter(key => !requiredKeys.includes(key) && !optionalKeys.includes(key));

    if (extraKeys.length > 0) {
        return response.status(400).send("Invalid keys in the payload: " + extraKeys.join(", "));
    }

    try {
        const id = request.params.id;
        let newDetails = request.body;
        newDetails.assignment_updated = new Date().toISOString();
        const updatedDetails = await updateAssignment(newDetails, id);
        return response.status(204).send('');
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

    if(!assignment) return response.status(404).send('');

    if (assignment.user_id != authenticated) {
        return response.status(403).send('');
    }

    try {
        const id = request.params.id;
        await removeAssignment(id);
        return response.status(204).send('');
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