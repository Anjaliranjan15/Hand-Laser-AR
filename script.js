const video = document.getElementById('cam');
navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
  video.srcObject = stream;
});

import { Hands } from 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js';

const hands = new Hands({ locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}` });
hands.setOptions({ maxNumHands: 2, modelComplexity: 1, minDetectionConfidence: 0.7 });
hands.onResults(onResults);

import { Camera } from 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js';
const camera = new Camera(video, {
  onFrame: async () => await hands.send({ image: video }),
  width: 640, height: 480
});
camera.start();

function onResults(results) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (results.multiHandLandmarks.length === 2) {
    const [handA, handB] = results.multiHandLandmarks;
    const tips = [4, 8, 12, 16, 20]; // thumb, index, middle, ring, pinky
    const colors = ['#ff0080', '#ff8800', '#ffff00', '#00ff88', '#00aaff'];
    tips.forEach((tipA, i) => {
      const a = handA[tipA], b = handB[tips[i]];
      ctx.beginPath();
      ctx.strokeStyle = colors[i];
      ctx.lineWidth = 3;
      ctx.shadowBlur = 12;
      ctx.shadowColor = colors[i];
      ctx.moveTo(a.x * canvas.width, a.y * canvas.height);
      ctx.lineTo(b.x * canvas.width, b.y * canvas.height);
      ctx.stroke();
    });
  }
}