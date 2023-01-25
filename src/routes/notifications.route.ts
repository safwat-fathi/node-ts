import { Router } from "express";
import { send, receive } from "controllers/notifications.controller";

const notification = Router();

// send to all
notification.post("/send", send);
notification.get("/receive", receive);

// create

export default notification;
