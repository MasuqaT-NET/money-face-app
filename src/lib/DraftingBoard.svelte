<script lang="ts">
  import type { FaceLandmarksDetector } from "@tensorflow-models/face-landmarks-detection";
  import { onMount } from "svelte";
  import type { CurrencySign, Point2d } from "../constants";

  export let detector: FaceLandmarksDetector;
  export let originalImage: HTMLImageElement;
  export let sign: CurrencySign;
  export let color: string;

  let canvas: HTMLCanvasElement;

  let facesPartCenters: {
    leftEye?: Point2d;
    rightEye?: Point2d;
    lips?: Point2d;
  }[];

  let svgHolder: HTMLElement;
  const fetchSign = async (sign: CurrencySign) => {
    const res = await fetch(`/currency-signs/${sign}.svg`);
    svgHolder.innerHTML = await res.text();

    render();
  };

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
    color;

    // noinspection JSUnusedAssignment
    render();
  }

  $: {
    // noinspection JSUnusedAssignment
    fetchSign(sign);
  }

  onMount(() => {
    analyze().then(() => render());
  });

  const analyze = async () => {
    facesPartCenters = [];
    const estimation = await detector.estimateFaces(originalImage);
    console.log(estimation);
    for (const face of estimation) {
      const leftEyePoints = face.keypoints.filter((x) => x.name === "leftEye");
      const rightEyePoints = face.keypoints.filter(
        (x) => x.name === "rightEye"
      );
      const lipsPoints = face.keypoints.filter((x) => x.name === "lips");

      facesPartCenters.push({
        leftEye: centerOf(leftEyePoints),
        rightEye: centerOf(rightEyePoints),
        lips: centerOf(lipsPoints),
      });
    }
  };

  const render = () => {
    const pathElement = svgHolder?.querySelector("path");
    if (!canvas || !pathElement) {
      return;
    }

    canvas.width = originalImage.width;
    canvas.height = originalImage.height;

    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(originalImage, 0, 0);

    const signSvg = svgHolder.querySelector("svg");
    const signPath = new Path2D(pathElement.getAttribute("d"));

    const drawSignAt = (targetCenter: { x: number; y: number }) => {
      const signSize = {
        width: +signSvg.getAttribute("width"),
        height: +signSvg.getAttribute("height"),
      };

      context.translate(
        targetCenter.x - signSize.width / 2,
        targetCenter.y - signSize.height / 2
      );
      context.fillStyle = color;
      context.fill(signPath);
      context.translate(
        -(targetCenter.x - signSize.width / 2),
        -(targetCenter.y - signSize.height / 2)
      );
    };

    for (const partCenters of facesPartCenters) {
      drawSignAt(partCenters.leftEye);
      drawSignAt(partCenters.rightEye);
      drawSignAt(partCenters.lips);
    }
  };

  // FIXME: 瞳の角度を考慮する
  const centerOf = (points: { x: number; y: number }[]) => {
    const xMin = Math.min(...points.map((p) => p.x));
    const xMax = Math.max(...points.map((p) => p.x));
    const yMin = Math.min(...points.map((p) => p.y));
    const yMax = Math.max(...points.map((p) => p.y));

    return { x: xMin + (xMax - xMin) / 2, y: yMin + (yMax - yMin) / 2 };
  };
</script>

<div>
  <canvas bind:this={canvas} />
  <div bind:this={svgHolder} style="display: none" />
</div>
