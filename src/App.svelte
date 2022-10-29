<script lang="ts">
  import type { FaceLandmarksDetector } from "@tensorflow-models/face-landmarks-detection";

  export let detector: FaceLandmarksDetector;

  import Uploader from "./lib/Uploader.svelte";
  import DraftingBoard from "./lib/DraftingBoard.svelte";
  import { onMount } from "svelte";
  import type { Currency } from "./constants";
  import { currencies } from "./constants.js";

  let originalImage: HTMLImageElement | null;
  let currency: Currency = "JPY";
  let signSize = 48;
  let signColor = "#000000";

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
  <h1>💲Money Face💲</h1>

  <Uploader on:loaded={loaded} />

  {#if originalImage}
    <DraftingBoard
      {detector}
      {originalImage}
      sign={{ currency, color: signColor, size: signSize }}
    />
  {/if}

  <fieldset>
    <legend>Sign</legend>

    <label for="currency">Currency</label>
    <select id="currency" bind:value={currency}>
      {#each currencies as c}
        <option value={c}>{c}</option>
      {/each}
    </select>

    <label for="color">Color</label>
    <input type="color" id="color" bind:value={signColor} />

    <label for="size">Size</label>
    <input type="range" id="size" bind:value={signSize} min="8" step="1" />
    {signSize}px
  </fieldset>
</main>
