import { Router } from "express";
import { notificationController } from "../controllers";
import { isAuth, isValidApiKey } from "../middleware";

const router = Router();

router.get("/message", isAuth, notificationController.getMessages);

router.post("/message", isValidApiKey, notificationController.createMessage);

export default router;
