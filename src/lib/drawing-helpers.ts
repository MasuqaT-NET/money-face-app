import type { Point2d } from "../constants";
import type { FaceLandmarksDetector } from "@tensorflow-models/face-landmarks-detection";

export type FacePartCenters = {
  leftEye?: Point2d;
  rightEye?: Point2d;
  lips?: Point2d;
};

export async function detectFacesPartsCenters(
  detector: FaceLandmarksDetector,
  image: HTMLImageElement
) {
  const result = [];

  const estimation = await detector.estimateFaces(image);
  for (const face of estimation) {
    const leftEyePoints = face.keypoints.filter((x) => x.name === "leftEye");
    const rightEyePoints = face.keypoints.filter((x) => x.name === "rightEye");
    const lipsPoints = face.keypoints.filter((x) => x.name === "lips");

    result.push({
      leftEye: centerOf(leftEyePoints),
      rightEye: centerOf(rightEyePoints),
      lips: centerOf(lipsPoints),
    });
  }

  return result;
}

// FIXME: 瞳の角度を考慮する
function centerOf(points: { x: number; y: number }[]) {
  const xMin = Math.min(...points.map((p) => p.x));
  const xMax = Math.max(...points.map((p) => p.x));
  const yMin = Math.min(...points.map((p) => p.y));
  const yMax = Math.max(...points.map((p) => p.y));

  return { x: xMin + (xMax - xMin) / 2, y: yMin + (yMax - yMin) / 2 };
}

export function drawSignAt(
  context: CanvasRenderingContext2D,
  targetCenter: { x: number; y: number },
  signConfig: {
    size: { width: number; height: number };
    color: string;
    path: Path2D;
  }
) {
  context.translate(
    targetCenter.x - signConfig.size.width / 2,
    targetCenter.y - signConfig.size.height / 2
  );
  context.fillStyle = signConfig.color;
  context.fill(signConfig.path);
  context.translate(
    -(targetCenter.x - signConfig.size.width / 2),
    -(targetCenter.y - signConfig.size.height / 2)
  );
}
