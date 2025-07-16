import { useRef, useEffect } from "react";

export const LocalVideoPreview = ({ stream }) => {
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
    <div className="w-60 md:w-80 lg:w-100 h-40 md:h-50 lg:h-60 bg-blue-300 rounded-xl absolute top-16 xl:top-4 left-4 overflow-hidden border-1 border-gray-300">
      <video
        id="local_video"
        className="rounded-sm w-full h-full object-cover"
        ref={videoRef}
        onLoadedMetadata={handleLoadedMetadata}
        autoPlay
      />
    </div>
  );
};

export default LocalVideoPreview;
