<script lang="ts">
  import type { FaceLandmarksDetector } from "@tensorflow-models/face-landmarks-detection";
  import { onMount } from "svelte";

  export let detector: FaceLandmarksDetector;
  export let originalImage: HTMLImageElement;

  let canvas: HTMLCanvasElement;

  $: {
    // runs on...
    originalImage;

    reset();
  }

  onMount(() => {
    reset();
  });

  const reset = async () => {
    if (!canvas) {
      return;
    }

    canvas.width = originalImage.width;
    canvas.height = originalImage.height;

    const context = canvas.getContext("2d");
    context.drawImage(originalImage, 0, 0);

    const estimation = await detector.estimateFaces(originalImage);
    console.log(estimation);
  };
</script>

<canvas bind:this={canvas} style="max-width: 50vw" />
