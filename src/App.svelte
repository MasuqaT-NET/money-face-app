<script lang="ts">
  import type { FaceLandmarksDetector } from "@tensorflow-models/face-landmarks-detection";

  export let detector: FaceLandmarksDetector;

  import Uploader from "./lib/Uploader.svelte";

  let canvas: HTMLCanvasElement;
  let originalImage: HTMLImageElement | null;
  let wipImage: HTMLImageElement | null;

  const resetWipImage = () => {
    wipImage = originalImage;

    refresh();
  };

  const refresh = async () => {
    canvas.width = wipImage.width;
    canvas.height = wipImage.height;

    const context = canvas.getContext("2d");
    context.drawImage(wipImage, 0, 0);

    const estimation = await detector.estimateFaces(wipImage);
    console.log(estimation);
  };

  const loaded = (e: CustomEvent<HTMLImageElement>) => {
    originalImage = e.detail;

    resetWipImage();
  };
</script>

<main>
  <h1>money-face-app</h1>

  <canvas bind:this={canvas} style="max-width: 50vw" />

  <Uploader on:loaded={loaded} />
</main>
