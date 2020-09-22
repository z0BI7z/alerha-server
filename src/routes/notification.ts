import { Router } from "express";
import { notificationController } from "../controllers";
import { isAuth } from "../middleware";

const router = Router();

router.post("/message", isAuth, notificationController.newMessage);

export default router;
