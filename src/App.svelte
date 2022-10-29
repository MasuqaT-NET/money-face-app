<script lang="ts">
  import type { FaceLandmarksDetector } from "@tensorflow-models/face-landmarks-detection";

  export let detector: FaceLandmarksDetector;

  import Uploader from "./lib/Uploader.svelte";
  import DraftingBoard from "./lib/DraftingBoard.svelte";
  import { onMount } from "svelte";
  import type { CurrencySign } from "./constants";
  import { currencySigns } from "./constants.js";

  let originalImage: HTMLImageElement | null;
  let currentSign: CurrencySign = "JPY";

  const loaded = (e: CustomEvent<HTMLImageElement>) => {
    originalImage = e.detail;
  };

  onMount(() => {
    // dev cheat
    let devImage = import.meta.env.VITE_FIXED_IMAGE;
    if (devImage) {
      const image = new Image();
      image.src = `dev-image/${devImage}`;
      image.onload = () => {
        originalImage = image;
      };
    }
  });
</script>

<main>
  <h1>money-face-app</h1>

  {#if originalImage}
    <DraftingBoard {detector} {originalImage} sign={currentSign} />
  {/if}

  <select bind:value={currentSign}>
    {#each currencySigns as sign}
      <option value={sign}>{sign}</option>
    {/each}
  </select>

  <Uploader on:loaded={loaded} />
</main>
