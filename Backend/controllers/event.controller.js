import { asyncHandler } from "../Utils/asyncHandler.js";
import { Event } from "../models/event.model.js"; 
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";


const createEvent = asyncHandler(async (req, res) => {
    console.log("EVents:",req.body)
    const { session_id, event_type, page_url, timestamp, click_x, click_y } = req.body;
    //validating
    if (!session_id || !event_type || !page_url || !timestamp) {
        throw new ApiError(400, "Missing required fields");
    }

    const event = await Event.create({
        session_id,
        event_type,
        page_url,
        timestamp,
        click_x,
        click_y
    });

    return res.status(201).json(
        new ApiResponse(201, event, "Event tracked successfully")
    );
});

// Get all sessions with event counts
const getAllSessions = asyncHandler(async (req, res) => {
    const sessions = await Event.aggregate([
        {
            $group: {
                _id: '$session_id',
                event_count: { $sum: 1 },
                first_seen: { $min: '$timestamp' },
                last_seen: { $max: '$timestamp' },
            },
        },
        { $sort: { last_seen: -1 } },
        {
            $project: {
                _id: 0,
                session_id: '$_id',
                event_count: 1,
                first_seen: 1,
                last_seen: 1
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, sessions, "Sessions fetched successfully")
    );
});

// Get all events for a specific session
const getSessionEvents = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;

    if (!sessionId) {
        throw new ApiError(400, "Session ID is required");
    }

    const events = await Event.find({ session_id: sessionId })
        .sort({ timestamp: 1 })
        .select('-__v');

    return res.status(200).json(
        new ApiResponse(200, events, "Session events fetched successfully")
    );
});

// Get click data for heatmap
const getHeatmapData = asyncHandler(async (req, res) => {
    const { page_url } = req.query;

    if (!page_url) {
        throw new ApiError(400, "Page URL is required");
    }

    const clicks = await Event.find({
        event_type: 'click',
        page_url: page_url,
    }).select('click_x click_y timestamp -_id');

    return res.status(200).json(
        new ApiResponse(200, clicks, "Heatmap data fetched successfully")
    );
});

// Get all unique page URLs
const getAllPages = asyncHandler(async (req, res) => {
    const pages = await Event.distinct('page_url');

    return res.status(200).json(
        new ApiResponse(200, pages, "Pages fetched successfully")
    );
});

export {
    createEvent,
    getAllSessions,
    getSessionEvents,
    getHeatmapData,
    getAllPages
};