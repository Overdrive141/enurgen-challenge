import type { Request, Response, NextFunction } from "express";
import { Send } from "express-serve-static-core";
import path from "path";

import { upload } from "../config/multer";
import { extractVertices } from "../../utils";
import { Point } from "../../types";

import { ImageService } from "../services/imageService";

type RectCoordinates = {
  id: number;
  coordinates: number[][];
};

interface ExtractCoordsResponse<ResBody> extends Response {
  json: Send<ResBody, this>;
}

// upload image middleware
export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const uploadResponse = upload.single("file");

  uploadResponse(req, res, (err) => {
    if (!req.file)
      return res.status(400).send({ error: "No file found to upload" });

    if (err) return res.status(400).json({ error: err.message });
    next();
  });
};

export const extractCoords = async (
  req: Request,
  res: ExtractCoordsResponse<RectCoordinates[]>,
  next: NextFunction
) => {
  try {
    const imagePath = path.join(__dirname, "../../..", req.file!.path);

    const imageService = new ImageService();
    const vertices: Point[][] = await imageService.processImage(imagePath);

    // extract vertices from coordinate set
    for (let i = 0; i < vertices.length; i++)
      vertices[i] = extractVertices(vertices[i]);

    const response = vertices.map((elem, idx) => {
      return { id: idx, coordinates: elem };
    });

    return res.status(200).json(response);
  } catch (err: any) {
    console.error(err);
    const apiError = new Error(err.toString());
    return next(apiError);
  }
};
