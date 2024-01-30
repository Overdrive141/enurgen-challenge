import express from "express";

import { extractCoords, uploadImage } from "../controllers/index.controller";

const router = express.Router();

/**
 * @api {post} extract-rect-coords/
 * @apiDescription Extracts coordinates from PNG image containing rectangles
 * @apiVersion 1.0.0
 * @apiName Extract Rectangle Coordinates
 * @apiGroup POST
 * @apiPermission public
 *
 */
router.route("/extract-rect-coords").post(uploadImage, extractCoords);

export default router;
