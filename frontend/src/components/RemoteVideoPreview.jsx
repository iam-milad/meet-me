import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const RemoteVideoPreview = ({ isRemoteCameraActive }) => {
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-zinc-800">
      <video
        id="remote_video"
        className={`w-full h-full absolute top-0 left-0 transition-opacity duration-300 ${
          isRemoteCameraActive ? "opacity-100" : "opacity-0"
        }`}
        autoPlay
      ></video>

      {!isRemoteCameraActive && (
        <div className="flex h-full justify-center items-center">
          <Avatar className="h-20 w-20 flex justify-center items-center">
            <AvatarFallback className="text-center font-bold text-2xl text-gray-700">
              {"TA"
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

export default RemoteVideoPreview;
