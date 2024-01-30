import { Colors, Point } from "../types";

/************************ Generic Utils *********************** */

const compareArrays = (a: any[], b: any[]) => {
  return a.toString() === b.toString();
};

/************************* Helper Utils *********************** */

const getPixelColor = (index: number, data: Buffer): Colors => {
  const WHITE_RGB = [255, 255, 255];
  const RGB =
    index > -1 ? [data[index], data[index + 1], data[index + 2]] : null;

  return RGB ? (compareArrays(RGB, WHITE_RGB) ? "white" : "black") : null;
};

const getPixelIndex = (width: number, x: number, y: number): number =>
  (width * y + x) << 2; // offset for RGBA (4 bytes)

export const createColorMatrix = (
  width: number,
  height: number,
  data: Buffer
): Colors[][] => {
  const pixelData: Colors[][] = new Array(height);

  for (let y = 0; y < height; y++) {
    pixelData[y] = new Array(width);

    for (let x = 0; x < width; x++) {
      const idx = getPixelIndex(width, x, y);
      pixelData[y][x] = getPixelColor(idx, data);
    }
  }

  return pixelData;
};

export const isWithinImageBounds = (
  x: number,
  y: number,
  width: number,
  height: number
): boolean => {
  return x >= 0 && x < width && y >= 0 && y < height;
};

// extract vertices from coordinates of a single rectangle
export const extractVertices = (coords: number[][]): Point[] => {
  let vertices = [
    [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
    [Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER],
    [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
    [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER],
  ];

  for (let i = 0; i < coords.length; i++) {
    const [x, y] = coords[i];

    // bottomLeft Edge
    if (x < vertices[0][0] || (x === vertices[0][0] && y < vertices[0][1])) {
      vertices[0] = [x, y];
    }

    // topRight Edge
    if (x > vertices[1][0] || (x === vertices[1][0] && y > vertices[1][1])) {
      vertices[1] = [x, y];
    }

    // bottomRight Edge
    if (y < vertices[2][1] || (y === vertices[2][1] && x > vertices[2][0])) {
      vertices[2] = [x, y];
    }

    // topLeft Edge
    if (y > vertices[3][1] || (y === vertices[3][1] && x < vertices[3][0])) {
      vertices[3] = [x, y];
    }
  }

  return vertices;
};
