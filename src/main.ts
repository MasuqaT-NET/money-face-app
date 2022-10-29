import "./app.css";
import App from "./App.svelte";

const result = await tf.setBackend("wasm");
console.log("Wasm backend:", result);

const detector = await faceLandmarksDetection.createDetector(
  faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
  {
    runtime: "tfjs",
  }
);

const app = new App({
  target: document.getElementById("app"),
  props: { detector },
});

export default app;
