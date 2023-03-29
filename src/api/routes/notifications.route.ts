import { Router } from "express";
import { send, receive } from "@/api/controllers/notifications.controller";

const notifications = Router();

// send to all
notifications.post("/send", send);
notifications.get("/receive", receive);

// create

export default notifications;
