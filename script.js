const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

// Request camera access
navigator.mediaDevices
  .getUserMedia({ video: { facingMode: "environment" } })
  .then((stream) => {
    video.srcObject = stream;
    video.play().catch((err) => console.error("Video play error:", err));
    scanQRCode(); // Start scanning
  })
  .catch((err) => console.error("Error accessing camera:", err));

function scanQRCode() {
  if (video.readyState !== video.HAVE_ENOUGH_DATA) {
    requestAnimationFrame(scanQRCode);
    return;
  }

  // Set canvas size to match video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Draw video frame on canvas
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Scan QR code
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const code = jsQR(imageData.data, imageData.width, imageData.height);

  if (code) {
    console.log("QR Code Detected: ", code.data);
    window.location.href = code.data; // Redirect to the scanned URL
  } else {
    requestAnimationFrame(scanQRCode);
  }
}
