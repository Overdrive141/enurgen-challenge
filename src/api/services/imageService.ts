import png from "pngjs";
import { createReadStream } from "fs";
import { createColorMatrix, isWithinImageBounds } from "../../utils";
import { Colors, Point } from "../../types";

const PNG = png.PNG;

export class ImageService {
  /**
   * performs dfs wto extract the edges of all rectangles when a black pixel is detected in an image
   * returns coordinates of all rectangles found in the image.
   */
  #extractRectangles(
    pixelColorData: Colors[][],
    width: number,
    height: number
  ): Point[][] {
    const visited: boolean[][] = Array.from({ length: height }, () =>
      Array(width).fill(false)
    );

    const rectangles: Point[][] = [];

    // assumes black pixels are part of a rectangle
    const dfs = (startX: number, startY: number, rectangleIndex: number) => {
      const stack: Point[] = [[startX, startY]];

      while (stack.length > 0) {
        const [x, y] = stack.pop()!; // Non-null assertion, assuming the stack is not empty

        if (
          !isWithinImageBounds(x, y, width, height) ||
          visited[y][x] ||
          pixelColorData[y][x] === "white"
        ) {
          continue;
        }

        visited[y][x] = true;
        rectangles[rectangleIndex].push([x, y]);

        stack.push([x + 1, y]);
        stack.push([x - 1, y]);
        stack.push([x, y + 1]);
        stack.push([x, y - 1]);
      }
    };

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (pixelColorData[y][x] === "black" && !visited[y][x]) {
          const newRectangle: Point[] = [];
          rectangles.push(newRectangle);
          dfs(x, y, rectangles.length - 1);
        }
      }
    }

    return rectangles;
  }

  async processImage(imageFilePath: string): Promise<number[][][]> {
    const imageStream = createReadStream(imageFilePath).pipe(new PNG());

    const extractRectangles = this.#extractRectangles;

    return new Promise((resolve, reject) => {
      imageStream
        .on("parsed", function () {
          const pixelColorData = createColorMatrix(
            this.width,
            this.height,
            this.data
          );
          const vertices: Point[][] = extractRectangles(
            pixelColorData,
            this.width,
            this.height
          );

          resolve(vertices);
        })
        .on("error", (err) => {
          console.error(err);
          reject(err);
        })
        .on("close", function () {
          console.log("Closed");
        });
    });
  }
}
