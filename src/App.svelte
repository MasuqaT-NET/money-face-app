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
  let color = "#000000";

  const loaded = (e: CustomEvent<HTMLImageElement>) => {
    originalImage = e.detail;
  };

  if (import.meta.env.VITE_FIXED_IMAGE) {
    // dev cheat
    onMount(() => {
      const image = new Image();
      image.src = `dev-image/${import.meta.env.VITE_FIXED_IMAGE}`;
      image.onload = () => {
        originalImage = image;
      };
    });
  }
</script>

<main>
  <h1>money-face-app</h1>

  {#if originalImage}
    <DraftingBoard {detector} {originalImage} sign={currentSign} {color} />
  {/if}

  <select bind:value={currentSign}>
    {#each currencySigns as sign}
      <option value={sign}>{sign}</option>
    {/each}
  </select>

  <input type="color" bind:value={color} />

  <Uploader on:loaded={loaded} />
</main>
