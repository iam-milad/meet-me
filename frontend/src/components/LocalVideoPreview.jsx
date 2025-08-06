import { useRef, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const LocalVideoPreview = ({
  stream,
  isCameraActive,
  participantName,
}) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  });

  const handleLoadedMetadata = () => {
    videoRef.current?.play();
  };

  return (
    <div className="w-60 md:w-80 lg:w-100 h-40 md:h-50 lg:h-60 bg-zinc-700 rounded-xl absolute top-16 xl:top-4 left-4 overflow-hidden border-1 border-gray-300">
      {isCameraActive ? (
        <video
          id="local_video"
          className="rounded-sm w-full h-full object-cover"
          ref={videoRef}
          onLoadedMetadata={handleLoadedMetadata}
        />
      ) : (
        <div className="flex h-full justify-center items-center">
          <Avatar className="h-20 w-20 flex justify-center items-center">
            <AvatarFallback className="text-center font-bold text-2xl text-gray-700">
              {participantName
                .split(" ")
                .map((word) => word[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
    </div>
  );
};

export default LocalVideoPreview;
