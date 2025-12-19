import { Router } from "express";
import {
    createEvent,
    getAllSessions,
    getSessionEvents,
    getHeatmapData,
    getAllPages
} from "../controllers/event.controller.js";

const router = Router();

// Store event
router.route('/').post(createEvent);

// Fetch all sessions
router.route('/sessions').get(getAllSessions);

// Fetch events for a specific session
router.route('/sessions/:sessionId').get(getSessionEvents);

// Fetch heatmap data
router.route('/heatmap').get(getHeatmapData);

// Fetch all pages
router.route('/pages').get(getAllPages);

export default router;