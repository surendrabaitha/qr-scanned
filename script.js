const video = document.createElement("video");
const canvasElement = document.createElement("canvas");
const canvas = canvasElement.getContext("2d");

// Get user camera
navigator.mediaDevices
  .getUserMedia({ video: { facingMode: "environment" } })
  .then((stream) => {
    video.srcObject = stream;
    video.setAttribute("playsinline", true);
    video.play();

    requestAnimationFrame(scanQRCode);
  })
  .catch((err) => {
    console.error("Error accessing camera: ", err);
  });

function scanQRCode() {
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    canvasElement.width = video.videoWidth;
    canvasElement.height = video.videoHeight;
    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

    const imageData = canvas.getImageData(
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });

    if (code) {
      console.log("QR Code Data:", code.data);
      window.location.href = code.data; // Redirect to scanned QR Code URL
    }
  }

  requestAnimationFrame(scanQRCode);
}
