import { useState, useRef, useEffect } from "react";

const Camera = ({ companyLogo, backgroundImage, companyName }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    let localStream;

    const startCamera = async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 720 },
            height: { ideal: 1280 },
          },
          audio: false,
        });

        localStream = s;

        if (videoRef.current) {
          videoRef.current.srcObject = s;

          videoRef.current.onloadedmetadata = async () => {
            try {
              await videoRef.current.play();
              setCameraReady(true);
            } catch (err) {
              console.error("Video play error:", err);
            }
          };
        }
      } catch (err) {
        console.error("Camera error:", err);
        alert("Camera permission denied or camera not available");
      }
    };

    startCamera();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      alert("Camera not ready");
      return;
    }

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      alert("Video not loaded yet");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    const imageData = canvas.toDataURL("image/png");
    setCapturedImage(imageData);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  return (
    <div
      className="relative h-screen w-full overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* top branding */}
      <div className="absolute top-4 left-4 right-4 z-20 sm:top-5 sm:left-6 sm:right-6 md:top-6 md:left-8 md:right-8">
        <div className="flex items-center gap-2 sm:gap-3">
          {companyLogo && (
            <img
              src={companyLogo}
              alt="logo"
              className="h-9 w-auto max-w-[90px] object-contain sm:h-11 md:h-12"
            />
          )}
          <span className="text-sm font-semibold text-white drop-shadow sm:text-lg md:text-xl">
            {companyName}
          </span>
        </div>
      </div>

      {/* camera area */}
      <div className="relative z-10 flex h-full items-center justify-center px-3  pb-1 sm:px-4 sm:pt-24 md:pt-28">
        <div
          className="
            relative w-full max-w-[340px]
            sm:max-w-[380px]
            md:max-w-[430px]
            lg:max-w-[400px]
            rounded-[28px] overflow-hidden bg-black shadow-2xl
          "
          style={{
            aspectRatio: "9 / 16",
            maxHeight: "calc(100vh - 120px)",
          }}
        >
          {!capturedImage ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover scale-x-[-1]"
            />
          ) : (
            <img
              src={capturedImage}
              alt="Captured"
              className="h-full w-full object-cover"
            />
          )}

          <canvas ref={canvasRef} className="hidden" />

          <div className="absolute bottom-5 left-0 right-0 z-20 flex justify-center">
            {!capturedImage ? (
              <button
                onClick={capturePhoto}
                disabled={!cameraReady}
                className="flex h-[64px] w-[64px] items-center justify-center rounded-full border-2 border-white/30 bg-white/10 backdrop-blur transition-all hover:bg-white/20 hover:border-white/60 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:h-[70px] sm:w-[70px]"
              >
                <span className="text-xl sm:text-2xl">📸</span>
              </button>
            ) : (
              <button
                onClick={retakePhoto}
                className="rounded-full border border-white/30 bg-white/15 px-5 py-2.5 text-sm text-white backdrop-blur transition-all hover:bg-white/25 sm:px-6 sm:py-3"
              >
                Retake
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Camera;