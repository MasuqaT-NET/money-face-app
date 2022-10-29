<script lang="ts">
  import type { FaceLandmarksDetector } from "@tensorflow-models/face-landmarks-detection";
  import { onMount } from "svelte";
  import type { Currency } from "../constants";
  import type { FacePartCenters } from "./drawing-helpers";
  import { detectFacesPartsCenters, drawSignAt } from "./drawing-helpers";

  export let detector: FaceLandmarksDetector;
  export let originalImage: HTMLImageElement;
  export let sign: { currency: Currency; color: string; size: number };

  let canvas: HTMLCanvasElement;

  let facesPartCenters: FacePartCenters[];

  let svgHolder: HTMLElement;

  $: {
    // runs on...
    // noinspection JSUnusedAssignment
    originalImage;

    // noinspection JSUnusedAssignment
    analyze().then(() => render());
  }

  $: {
    // runs on...
    // noinspection JSUnusedAssignment
    sign.color;

    // noinspection JSUnusedAssignment
    render();
  }

  $: {
    // noinspection JSUnusedAssignment
    fetch(`/currency-signs/${sign.currency}.svg`)
      .then((res) => res.text())
      .then((text) => {
        svgHolder.innerHTML = text;

        render();
      });
  }

  onMount(() => {
    analyze().then(() => render());
  });

  const analyze = async () => {
    facesPartCenters = [];
    facesPartCenters = await detectFacesPartsCenters(detector, originalImage);
  };

  const render = () => {
    const pathElement = svgHolder?.querySelector("path");
    if (!canvas || !pathElement) {
      return;
    }

    canvas.width = originalImage.width;
    canvas.height = originalImage.height;

    const context = canvas.getContext("2d");
    context.resetTransform();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(originalImage, 0, 0);

    const signSvg = svgHolder.querySelector("svg");
    const signPath = new Path2D(pathElement.getAttribute("d"));
    const signImageSize = {
      width: +signSvg.getAttribute("width"),
      height: +signSvg.getAttribute("height"),
    };
    const signConfig = {
      size: { width: sign.size, height: sign.size },
      imageSize: signImageSize,
      color: sign.color,
      path: signPath,
    };

    for (const partCenters of facesPartCenters) {
      drawSignAt(context, partCenters.leftEye, signConfig);
      drawSignAt(context, partCenters.rightEye, signConfig);
      drawSignAt(context, partCenters.lips, signConfig);
    }
  };

  const handleShareClick = () => {
    canvas.toBlob((blob) => {
      const shareImage = new File([blob], "share.png", { type: "image/png" });

      navigator.share({
        text: "#MoneyFace",
        files: [shareImage],
      });
    });
  };
</script>

<div>
  <canvas bind:this={canvas} />
  <button on:click={handleShareClick}>Share</button>
  <div bind:this={svgHolder} style="display: none" />
</div>
