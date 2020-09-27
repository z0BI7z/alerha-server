import { Router } from "express";
import { notificationController } from "../controllers";
import { isAuth, isValidApiKey } from "../middleware";

const router = Router();

router.get("/message", isAuth, notificationController.getMessages);

router.post("/message", isValidApiKey, notificationController.createMessage);

router.delete("/message", isAuth, notificationController.deleteMessages);

export default router;
