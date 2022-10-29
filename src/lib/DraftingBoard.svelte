<script lang="ts">
  import type { FaceLandmarksDetector } from "@tensorflow-models/face-landmarks-detection";
  import { onMount } from "svelte";

  export let detector: FaceLandmarksDetector;
  export let originalImage: HTMLImageElement;

  let canvas: HTMLCanvasElement;
  let wipImage: HTMLImageElement;

  $: {
    wipImage = originalImage;

    reset();
  }

  onMount(() => {
    reset();
  });

  const reset = async () => {
    if (!canvas) {
      return;
    }

    canvas.width = wipImage.width;
    canvas.height = wipImage.height;

    const context = canvas.getContext("2d");
    context.drawImage(wipImage, 0, 0);

    const estimation = await detector.estimateFaces(wipImage);
    console.log(estimation);
  };
</script>

<canvas bind:this={canvas} style="max-width: 50vw" />
