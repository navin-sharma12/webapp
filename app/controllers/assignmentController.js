import { authenticate, addAssignment, removeAssignment, getAllAssignments, getAssignmentById, updateAssignment, healthCheck } from "../services/assignmentService.js";
import db from "../config/dbSetup.js";
import StatsD from "node-statsd";
import appLogger from "../config/logger.js";
import config from '../config/dbConfig.js';

const statsd = new StatsD({ host: config.database.statsdhost, port: config.database.statsdPort });

function useRegex(input) {
    let regexDeadline = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?([Zz])$/;
    return regexDeadline.test(input);
}

//Create assignment
export const post = async (request, response) => {

    statsd.increment("endpoint.post.post");

    const health = await healthCheck();
    if (health !== true) {
        appLogger.warn("Post API unavailable: health check failed.");
        return response.status(503).header('Cache-Control', 'no-cache, no-store, must-revalidate').send('');
    }

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        appLogger.warn("Post API user authentication failed.");
        return response.status(401).send('');
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');

    const authenticated = await authenticate(email, password);

    if (authenticated === null) {
        appLogger.warn("Post API user authentication failed.");
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
        appLogger.warn("Post API Invalid body, parameters missing.");
        return response.status(400).send("Missing required keys: " + missingKeys.join(", "));
    }

    // Check if there are any additional keys in the payload
    const extraKeys = bodyKeys.filter(key => !requiredKeys.includes(key) && !optionalKeys.includes(key));

    if (extraKeys.length > 0) {
        appLogger.warn("Post API Invalid body, parameters missing");
        return response.status(400).send("Invalid keys in the payload: " + extraKeys.join(", "));
    }

    try {
        let newDetails = request.body;
        newDetails.user_id = authenticated;
        newDetails.assignment_created = new Date().toISOString();
        newDetails.assignment_updated = new Date().toISOString();
        if (!Number.isInteger(newDetails.points) || !Number.isInteger(newDetails.num_of_attempts)) {
            appLogger.warn("Bad request: Invalid body parameters, points and number of attempts should be integer");
            return response.status(400).send();
        }
        if (!(typeof newDetails.name === 'string' || newDetails.name instanceof String)) {
            appLogger.warn("Bad request: Invalid body parameters, name must be string");
            return response.status(400).send();
        }
        if (!useRegex(newDetails.deadline)) {
            appLogger.warn("Bad request: Invalid body parameter deadline in post API");
            return response.status(400).send();
        }
        const savedDetails = await addAssignment(newDetails);
        appLogger.info("Post successfull.");
        return response.status(201).send('');
    } catch (error) {
        appLogger.error("Post API bad request.", error);
        return response.status(400).send('');
    }
};

//get all the assignments
export const getAssignments = async (request, response) => {

    statsd.increment("endpoint.get.getAssignments");

    const health = await healthCheck();
    if (health !== true) {
        appLogger.warn("Get all API unavailable: health check failed.");
        return response.status(503).header('Cache-Control', 'no-cache, no-store, must-revalidate').send('');
    }

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        appLogger.warn("Get all API user authentication failed.");
        return response.status(401).send('');
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');

    const authenticated = await authenticate(email, password);

    if (authenticated === null) {
        appLogger.warn("Get all API user authentication failed.");
        return response.status(401).send('');
    }

    try {
        const assignments = await getAllAssignments(authenticated);

        if (assignments.length === 0) {
            appLogger.warn("Get all API 404 page not found error.");
            return response.status(404).send('');
        } if (request.body && Object.keys(request.body).length > 0) {
            appLogger.warn("Get all API Invalid body, parameters missing.");
            return response.status(400).send();
        }
        else {
            appLogger.info("Get all API successfull.");
            return response.status(200).send(assignments);
        }
    } catch (error) {
        appLogger.error("Get all API bad request.", error);
        return response.status(400).send('');
    }

}

//get assignment by Id
export const getAssignmentUsingId = async (request, response) => {

    statsd.increment("endpoint.get.getAssignmentUsingId");

    const health = await healthCheck();
    if (health !== true) {
        appLogger.warn("Get by id API unavailable: health check failed.");
        return response.status(503).header('Cache-Control', 'no-cache, no-store, must-revalidate').send('');
    }

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        appLogger.warn("Get by id API user authentication failed.");
        return response.status(401).send('');
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');

    const authenticated = await authenticate(email, password);

    if (authenticated === null) {
        appLogger.warn("Get by id API user authentication failed.");
        return response.status(401).send('');
    }

    const assignment = await db.assignment.findOne({
        where: { id: request.params.id },
    });
    if (!assignment) {
        appLogger.warn("Get by id API assignment not found.");
        return response.status(204).send("");
    }

    try {
        const id = request.params.id;
        const assignments = await getAssignmentById(authenticated, id);

        if (assignments.length === 0) {
            appLogger.warn("Get by id API 404 page not found error.");
            return response.status(200).send('');
        } if (request.body && Object.keys(request.body).length > 0) {
            appLogger.warn("Get by id API Invalid body, parameters missing.");
            return response.status(400).send();
        } else {
            appLogger.info("Get by id API successfull.");
            return response.status(200).send(assignments);
        }
    } catch (error) {
        appLogger.error("Get by id API bad request.", error);
        return response.status(400).send('');
    }

}

//update assignment
export const updatedAssignment = async (request, response) => {

    statsd.increment("endpoint.put.updatedAssignment");

    const health = await healthCheck();
    if (health !== true) {
        appLogger.warn("Update API unavailable: health check failed.");
        return response.status(503).header('Cache-Control', 'no-cache, no-store, must-revalidate').send('');
    }

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        appLogger.warn("Update API user authentication failed.");
        return response.status(401).send('');
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');

    const authenticated = await authenticate(email, password);

    if (authenticated === null) {
        appLogger.warn("Update API user authentication failed.");
        return response.status(401).send('');
    }

    const assignment = await db.assignment.findOne({ where: { id: request.params.id } });
    if (!assignment) return response.status(404).send('');

    if (assignment.user_id != authenticated) {
        appLogger.warn("Update API user not authorized to update the details.");
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
        appLogger.warn("Update API Invalid body, parameters missing.");
        return response.status(400).send("Missing required keys: " + missingKeys.join(", "));
    }

    // Check if there are any additional keys in the payload
    const extraKeys = bodyKeys.filter(key => !requiredKeys.includes(key) && !optionalKeys.includes(key));

    if (extraKeys.length > 0) {
        appLogger.warn("Update API Invalid body, parameters missing.");
        return response.status(400).send("Invalid keys in the payload: " + extraKeys.join(", "));
    }

    try {
        const id = request.params.id;
        let newDetails = request.body;
        newDetails.assignment_updated = new Date().toISOString();
        if (!Number.isInteger(newDetails.points) || !Number.isInteger(newDetails.num_of_attempts)) {
            appLogger.warn("Bad request: Invalid body parameters, points and number of attempts should be integer");
            return response.status(400).send();
        }
        if (!(typeof newDetails.name === 'string' || newDetails.name instanceof String)) {
            appLogger.warn("Bad request: Invalid body parameters, name must be string");
            return response.status(400).send();
        }
        if (!useRegex(newDetails.deadline)) {
            appLogger.warn("Bad request: Invalid body parameter deadline in post API");
            return response.status(400).send();
        }
        const updatedDetails = await updateAssignment(newDetails, id);
        appLogger.info("Update API successfull.");
        return response.status(204).send('');
    } catch (error) {
        appLogger.error("Update API bad request error.", error);
        return response.status(400).send('');
    }
};

//remove the assignment
export const remove = async (request, response) => {

    statsd.increment("endpoint.delete.remove");

    const health = await healthCheck();
    if (health !== true) {
        appLogger.warn("Delete API unavailable: health check failed.");
        return response.status(503).header('Cache-Control', 'no-cache, no-store, must-revalidate').send('');
    }

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        appLogger.warn("Delete API user authentication failed.");
        return response.status(401).send('');
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');

    const authenticated = await authenticate(email, password);

    if (authenticated === null) {
        appLogger.warn("Delete API user authentication failed.");
        return response.status(401).send('');
    }

    const assignment = await db.assignment.findOne({ where: { id: request.params.id } });

    if (!assignment) return response.status(404).send('');

    if (assignment.user_id != authenticated) {
        appLogger.warn("Delete API user not authorized to delete the details.");
        return response.status(403).send('');
    }

    try {
        const id = request.params.id;
        await removeAssignment(id);
        appLogger.info("Delete API successfull.");
        return response.status(204).send('');
    } catch (error) {
        appLogger.error("Delete API bad request error.", error);
        return response.status(400).send('');
    }
};

//healthz check for assignment
export const healthz = async (request, response) => {
    statsd.increment("endpoint.all.healthz");
    if (request.method !== 'GET') {
        appLogger.warn("Healthz API method not allowed error.");
        return response.status(405).send('');
    } else if (request.headers['content-length'] > 0) {
        appLogger.warn("Healthz API bad request error: body and parameters are not allowed");
        return response.status(400).send('');
    } else if (request.query && Object.keys(request.query).length > 0) {
        appLogger.warn("Healthz API bad request error: body and parameters are not allowed");
        return response.status(400).send('');
    } else {
        try {
            const health = await healthCheck();
            if (health === true) {
                appLogger.info("Healthz API successfull.");
                return response.status(200).header('Cache-Control', 'no-cache, no-store, must-revalidate').send('');
            } else {
                appLogger.warn("Healthz API service unavailable");
                return response.status(503).header('Cache-Control', 'no-cache, no-store, must-revalidate').send('');
            }
        } catch (error) {
            appLogger.warn("Healthz API service unavailable");
            return response.status(503).header('Cache-Control', 'no-cache, no-store, must-revalidate').send('');
        }
    }
}