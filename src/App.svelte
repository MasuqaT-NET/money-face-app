<script lang="ts">
  import type { FaceLandmarksDetector } from "@tensorflow-models/face-landmarks-detection";

  export let detector: FaceLandmarksDetector;

  import Uploader from "./lib/Uploader.svelte";
  import DraftingBoard from "./lib/DraftingBoard.svelte";

  let originalImage: HTMLImageElement | null;

  const loaded = (e: CustomEvent<HTMLImageElement>) => {
    originalImage = e.detail;
  };
</script>

<main>
  <h1>money-face-app</h1>

  {#if originalImage}
    <DraftingBoard {detector} {originalImage} />
  {/if}

  <Uploader on:loaded={loaded} />
</main>
