declare global {
  import type TF from "@tensorflow/tfjs";
  // eslint-disable-next-line
  var tf: typeof TF;

  import type TFMFLD from "@tensorflow-models/face-landmarks-detection";
  // eslint-disable-next-line
  var faceLandmarksDetection: typeof TFMFLD;
}
