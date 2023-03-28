import { Router } from "express";
import { createToken, getToken } from "../controllers/token.controller";

const token = Router();

// * GET
token.get("/", getToken);
// * CREATE
token.post("/", createToken);

export default token;
