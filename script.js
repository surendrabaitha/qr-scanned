const video = document.getElementById("camera-feed");
const canvas = document.getElementById("qr-canvas");
const ctx = canvas.getContext("2d");

// Access camera
navigator.mediaDevices
  .getUserMedia({ video: { facingMode: "environment" } })
  .then((stream) => {
    video.srcObject = stream;
    video.setAttribute("playsinline", true);
    video.play();
    scanQRCode();
  });

// Function to scan QR code
function scanQRCode() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const qrCode = jsQR(imageData.data, canvas.width, canvas.height);

  if (qrCode) {
    const { topLeftCorner, bottomRightCorner } = qrCode.location;

    // Calculate QR position (left, right, center)
    const position =
      topLeftCorner.x < canvas.width / 3
        ? "left"
        : topLeftCorner.x > (2 * canvas.width) / 3
        ? "right"
        : "center";

    // Redirect with position data
    window.location.href = `video.html?position=${position}`;
  }

  requestAnimationFrame(scanQRCode);
}
