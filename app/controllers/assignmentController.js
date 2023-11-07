import { authenticate, addAssignment, removeAssignment, getAllAssignments, getAssignmentById, updateAssignment, healthCheck } from "../services/assignmentService.js";
import db from "../config/dbSetup.js";
import StatsD from "node-statsd";
import appLogger from "../config/logger.js";
const statsd = new StatsD({ host: "127.0.0.1", port: 8125 });

//Create assignment
export const post = async (request, response) => {

    statsd.increment("endpoint.post.post");

    const health = await healthCheck();
    if (health !== true) {
        appLogger.error("Post API unavailable error.");
        return response.status(503).header('Cache-Control', 'no-cache, no-store, must-revalidate').send('');
    }

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        appLogger.error("Post API unauthorized error.");
        return response.status(401).send('');
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');

    const authenticated = await authenticate(email, password);

    if (authenticated === null) {
        appLogger.error("Post API unauthorized error.");
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
        appLogger.error("Post API bad request.");
        return response.status(400).send("Missing required keys: " + missingKeys.join(", "));
    }

    // Check if there are any additional keys in the payload
    const extraKeys = bodyKeys.filter(key => !requiredKeys.includes(key) && !optionalKeys.includes(key));

    if (extraKeys.length > 0) {
        appLogger.error("Post API bad request.");
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
        appLogger.error("Post API bad request.");
        return response.status(400).send('');
    }
};

//get all the assignments
export const getAssignments = async (request, response) => {

    statsd.increment("endpoint.get.getAssignments");

    const health = await healthCheck();
    if (health !== true) {
        appLogger.error("Get all API unavailable error.");
        return response.status(503).header('Cache-Control', 'no-cache, no-store, must-revalidate').send('');
    }

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        appLogger.error("Get all API unauthorized error.");
        return response.status(401).send('');
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');

    const authenticated = await authenticate(email, password);

    if (authenticated === null) {
        appLogger.error("Get all API unauthorized error.");
        return response.status(401).send('');
    }

    try {
        const assignments = await getAllAssignments(authenticated);

        if (assignments.length === 0) {
            appLogger.error("Get all API 404 page not found error.");
            return response.status(404).send('');
        } if (request.body && Object.keys(request.body).length > 0) {
            appLogger.error("Get all API bad request.");
            return response.status(400).send();
        }
        else {
            appLogger.info("Get all API successfull.");
            return response.status(200).send(assignments);
        }
    } catch (error) {
        appLogger.error("Get all API bad request.");
        return response.status(400).send('');
    }

}

//get assignment by Id
export const getAssignmentUsingId = async (request, response) => {

    statsd.increment("endpoint.get.getAssignmentUsingId");

    const health = await healthCheck();
    if (health !== true) {
        appLogger.error("Get by id API unavailable error.");
        return response.status(503).header('Cache-Control', 'no-cache, no-store, must-revalidate').send('');
    }

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        appLogger.error("Get by id API unauthorized error.");
        return response.status(401).send('');
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');

    const authenticated = await authenticate(email, password);

    if (authenticated === null) {
        appLogger.error("Get by id API unauthorized error.");
        return response.status(401).send('');
    }

    const assignment = await db.assignment.findOne({
        where: { id: request.params.id },
    });
    if (!assignment) {
        appLogger.error("Get by id API assignment not found error.");
        return response.status(204).send("");
    }

    try {
        const id = request.params.id;
        const assignments = await getAssignmentById(authenticated, id);

        if (assignments.length === 0) {
            appLogger.error("Get by id API successfull.");
            return response.status(200).send('');
        } if (request.body && Object.keys(request.body).length > 0) {
            appLogger.error("Get by id API bad request.");
            return response.status(400).send();
        } else {
            appLogger.info("Get by id API successfull.");
            return response.status(200).send(assignments);
        }
    } catch (error) {
        appLogger.error("Get by id API bad request.");
        return response.status(400).send('');
    }

}

//update assignment
export const updatedAssignment = async (request, response) => {

    statsd.increment("endpoint.put.updatedAssignment");

    const health = await healthCheck();
    if (health !== true) {
        appLogger.error("Update API unavailable error.");
        return response.status(503).header('Cache-Control', 'no-cache, no-store, must-revalidate').send('');
    }

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        appLogger.error("Update API unauthorized error.");
        return response.status(401).send('');
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');

    const authenticated = await authenticate(email, password);

    if (authenticated === null) {
        appLogger.error("Update API unauthorized error.");
        return response.status(401).send('');
    }

    const assignment = await db.assignment.findOne({ where: { id: request.params.id } });
    if(!assignment) return response.status(404).send('');

    if (assignment.user_id != authenticated) {
        appLogger.error("Update API forbidden error.");
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
        appLogger.error("Update API bad request error.");
        return response.status(400).send("Missing required keys: " + missingKeys.join(", "));
    }

    // Check if there are any additional keys in the payload
    const extraKeys = bodyKeys.filter(key => !requiredKeys.includes(key) && !optionalKeys.includes(key));

    if (extraKeys.length > 0) {
        appLogger.error("Update API bad request error.");
        return response.status(400).send("Invalid keys in the payload: " + extraKeys.join(", "));
    }

    try {
        const id = request.params.id;
        let newDetails = request.body;
        newDetails.assignment_updated = new Date().toISOString();
        const updatedDetails = await updateAssignment(newDetails, id);
        appLogger.info("Update API successfull.");
        return response.status(204).send('');
    } catch (error) {
        appLogger.error("Update API bad request error.");
        return response.status(400).send('');
    }
};

//remove the assignment
export const remove = async (request, response) => {

    statsd.increment("endpoint.delete.remove");

    const health = await healthCheck();
    if (health !== true) {
        appLogger.error("Delete API unavailable error.");
        return response.status(503).header('Cache-Control', 'no-cache, no-store, must-revalidate').send('');
    }

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        appLogger.error("Delete API unauthorized error.");
        return response.status(401).send('');
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');

    const authenticated = await authenticate(email, password);

    if (authenticated === null) {
        appLogger.error("Delete API unauthorized error.");
        return response.status(401).send('');
    }

    const assignment = await db.assignment.findOne({ where: { id: request.params.id } });

    if(!assignment) return response.status(404).send('');

    if (assignment.user_id != authenticated) {
        appLogger.error("Delete API forbidden error.");
        return response.status(403).send('');
    }

    try {
        const id = request.params.id;
        await removeAssignment(id);
        appLogger.info("Delete API successfull.");
        return response.status(204).send('');
    } catch (error) {
        appLogger.error("Delete API bad request error.");
        return response.status(400).send('');
    }
};

//healthz check for assignment
export const healthz = async (request, response) => {
    statsd.increment("endpoint.all.healthz");
    if (request.method !== 'GET') {
        appLogger.error("Healthz API method not allowed error.");
        return response.status(405).send('');
    } else if (request.headers['content-length'] > 0) {
        appLogger.error("Healthz API bad request error.");
        return response.status(400).send('');
    } else if (request.query && Object.keys(request.query).length > 0) {
        appLogger.error("Healthz API bad request error.");
        return response.status(400).send('');
    } else {
        try {
            const health = await healthCheck();
            if (health === true) {
                appLogger.info("Healthz API successfull.");
                return response.status(200).header('Cache-Control', 'no-cache, no-store, must-revalidate').send('');
            } else {
                appLogger.error("Healthz API service unavailable");
                return response.status(503).header('Cache-Control', 'no-cache, no-store, must-revalidate').send('');
            }
        } catch (error) {
            appLogger.error("Healthz API service unavailable");
            return response.status(503).header('Cache-Control', 'no-cache, no-store, must-revalidate').send('');
        }
    }
}