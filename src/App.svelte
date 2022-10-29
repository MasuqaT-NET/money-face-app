<script lang="ts">
  import svelteLogo from "./assets/svelte.svg";
  import Counter from "./lib/Counter.svelte";
  import Uploader from "./lib/Uploader.svelte";

  let canvas: HTMLCanvasElement;
  let originalImage: Image | null;
  let wipImage: Image | null;

  const resetWipImage = () => {
    wipImage = originalImage;

    refresh();
  };

  const refresh = () => {
    canvas.width = wipImage.width;
    canvas.height = wipImage.height;

    const context = canvas.getContext("2d");
    context.drawImage(wipImage, 0, 0);
  };

  const loaded = (e: CustomEvent<Image>) => {
    originalImage = e.detail;

    resetWipImage();
  };
</script>

<main>
  <div>
    <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
      <img src="/vite.svg" class="logo" alt="Vite Logo" />
    </a>
    <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a>
  </div>
  <h1>Vite + Svelte</h1>

  <canvas bind:this={canvas} style="max-width: 50vw" />

  <Uploader on:loaded={loaded} />

  <div class="card">
    <Counter />
  </div>

  <p>
    Check out <a
      href="https://github.com/sveltejs/kit#readme"
      target="_blank"
      rel="noreferrer">SvelteKit</a
    >, the official Svelte app framework powered by Vite!
  </p>

  <p class="read-the-docs">Click on the Vite and Svelte logos to learn more</p>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
