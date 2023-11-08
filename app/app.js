import express from "express";
import cors from "cors";
import route from "./routes/index.js";
import initializeDatabase from './services/userService.js';
import bodyParserErrorHandler from 'express-body-parser-error-handler';

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParserErrorHandler());
route(app);

initializeDatabase();
export default app;