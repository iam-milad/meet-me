import { useRef, useEffect } from "react";

export const LocalVideo = ({ stream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const handleLoadedMetadata = () => {
    videoRef.current?.play();
  };

  return (
    <video
      id="local_video"
      className="rounded-sm w-full h-ful"
      ref={videoRef}
      onLoadedMetadata={handleLoadedMetadata}
      autoPlay
      muted
      playsInline
    />
  );
};

export default LocalVideo;
