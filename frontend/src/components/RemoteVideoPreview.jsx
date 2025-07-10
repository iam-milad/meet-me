const RemoteVideoPreview = () => {
  return (
    <video
      id="remote_video"
      className="w-full h-screen bg-amber-100 absolute top-0 hidden"
      muted
      autoPlay
    ></video>
  );
};

export default RemoteVideoPreview;
