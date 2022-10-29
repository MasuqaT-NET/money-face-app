<script lang="ts">
  import type { FaceLandmarksDetector } from "@tensorflow-models/face-landmarks-detection";
  import { onMount } from "svelte";

  export let detector: FaceLandmarksDetector;
  export let originalImage: HTMLImageElement;

  let canvas: HTMLCanvasElement;

  $: {
    // runs on...
    // noinspection JSUnusedAssignment
    originalImage;

    // noinspection JSUnusedAssignment
    reset();
  }

  onMount(() => {
    reset();
  });

  // FIXME: 瞳の角度を考慮する
  const getBoundingBox = (points: { x: number; y: number }[]) => {
    const x = Math.min(...points.map((p) => p.x));
    const width = Math.max(...points.map((p) => p.x)) - x;
    const y = Math.min(...points.map((p) => p.y));
    const height = Math.max(...points.map((p) => p.y)) - y;

    return { x, y, width, height };
  };

  const reset = async () => {
    if (!canvas) {
      return;
    }

    canvas.width = originalImage.width;
    canvas.height = originalImage.height;

    const context = canvas.getContext("2d");
    context.drawImage(originalImage, 0, 0);
    context.fillStyle = "green";

    const estimation = await detector.estimateFaces(originalImage);
    for (const face of estimation) {
      const leftEyePoints = face.keypoints.filter((x) => x.name === "leftEye");
      const rightEyePoints = face.keypoints.filter(
        (x) => x.name === "rightEye"
      );
      const lipsPoints = face.keypoints.filter((x) => x.name === "lips");

      const leftEyeBox = getBoundingBox(leftEyePoints);
      context.fillRect(
        leftEyeBox.x,
        leftEyeBox.y,
        leftEyeBox.width,
        leftEyeBox.height
      );

      const rightEyeBox = getBoundingBox(rightEyePoints);
      context.fillRect(
        rightEyeBox.x,
        rightEyeBox.y,
        rightEyeBox.width,
        rightEyeBox.height
      );

      const lipsBox = getBoundingBox(lipsPoints);
      context.fillRect(lipsBox.x, lipsBox.y, lipsBox.width, lipsBox.height);
    }
  };
</script>

<canvas bind:this={canvas} style="width: 75vw" />
