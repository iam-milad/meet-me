const RemoteVideoPreview = () => {
  return (
    <video
      id="remote_video"
      className="absolute top-0 left-0 w-full h-full bg-blue-400"
      muted
      autoPlay
    ></video>
  );
};

export default RemoteVideoPreview;
