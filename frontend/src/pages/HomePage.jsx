import { useState } from "react";

import { IoMdMic } from "react-icons/io";
import { IoMdMicOff } from "react-icons/io";
import { BiCamera } from "react-icons/bi";
import { BiCameraOff } from "react-icons/bi";
import { LuScreenShare } from "react-icons/lu";
import { LuScreenShareOff } from "react-icons/lu";
import { MdCallEnd } from "react-icons/md";
import { BsRecordCircle } from "react-icons/bs";
import { BsStopCircleFill } from "react-icons/bs";
import { LuCopy } from "react-icons/lu";
import { LuCircleCheck } from "react-icons/lu";
import { MdOutlineAddReaction } from "react-icons/md";
import { MdOutlineChatBubbleOutline } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";

import Drawer from "../components/Drawer";
import CopyableText from "../components/CopyableText";



const HomePage = () => {
  const [isMicActive, setIsMicActive] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(true);
  const [isRecording, setIsRecording] = useState(true);
  const [showImojiesPicker, setShowEmojiesPicker] = useState(false);

  const toggleMic = () => {
    setIsMicActive((prev) => !prev);
  };

  const toggleCamera = () => {
    setIsCameraActive((prev) => !prev);
  };

  const toggleScreenSharing = () => {
    setIsScreenSharing((prev) => !prev);
  };

  const toggleRecording = () => {
    setIsRecording((prev) => !prev);
  };

  const showEmojiesPickerHandler = () => {
    setShowEmojiesPicker((prev) => !prev);
  };

  const emojiClickHandler = (emoji) => {
    console.log("emoji selected", emoji);
    setShowEmojiesPicker(false);
  };

  return (
    <main className="h-screen">
      <section className="relative w-full h-screen">
        <CopyableText text="23jhh2j4gh323j4g23hg23hj23" />

        <video
          id="remote_video"
          className="w-full h-screen bg-amber-100 absolute top-0 hidden"
          muted
          autoPlay
        ></video>

        <div className="w-60 md:w-80 lg:w-100 h-40 md:h-50 lg:h-60 bg-blue-300 rounded-xl absolute top-16 xl:top-4 left-4">
          <video id="local-video"></video>
        </div>

        <div className="flex justify-center">
          <div className="flex absolute w-[350px] md:w-[390px] h-[75px] bottom-[80px] md:bottom-[100px] justify-between items-center">
            <button
              className="w-[50px] h-[50px] bg-[rgba(0,0,0,0.2)] rounded-[50px] transition duration-300 flex justify-center items-center cursor-pointer"
              onClick={toggleMic}
            >
              {isMicActive ? (
                <IoMdMic size={25} className="text-white" />
              ) : (
                <IoMdMicOff size={25} className="text-white" />
              )}
            </button>
            <button
              className="w-[50px] h-[50px] bg-[rgba(0,0,0,0.2)] rounded-[50px] transition duration-300 flex justify-center items-center cursor-pointer"
              onClick={toggleCamera}
            >
              {isCameraActive ? (
                <BiCamera size={25} className="text-white" />
              ) : (
                <BiCameraOff size={25} className="text-white" />
              )}
            </button>
            <button className="w-[75px] h-[75px] rounded-[75px] bg-[#fc5d5b] transition duration-300 flex justify-center items-center cursor-pointer">
              <MdCallEnd size={30} className="text-white" />
            </button>
            <button
              className="w-[50px] h-[50px] bg-[rgba(0,0,0,0.2)] rounded-[50px] transition duration-300 flex justify-center items-center cursor-pointer"
              onClick={toggleScreenSharing}
            >
              {isScreenSharing ? (
                <LuScreenShare size={25} className="text-white" />
              ) : (
                <LuScreenShareOff size={25} className="text-white" />
              )}
            </button>
            <button
              className="w-[50px] h-[50px] bg-[rgba(0,0,0,0.2)] rounded-[50px] transition duration-300 flex justify-center items-center cursor-pointer"
              onClick={toggleRecording}
            >
              {isRecording ? (
                <BsRecordCircle size={25} className="text-red-500" />
              ) : (
                <BsStopCircleFill size={25} className="text-red-500" />
              )}
            </button>
          </div>
          
          <div className="absolute bottom-0 md:bottom-3 h-[70px] w-full md:w-[400px] md:rounded-full bg-blue-500">
            <div className="text-white h-full flex justify-center items-center gap-32">
              <div className="absolute bottom-12 animate-rise z-10">
                <EmojiPicker
                  onEmojiClick={emojiClickHandler}
                  open={showImojiesPicker}
                  onClickAway={() => {
                    setShowEmojiesPicker(false);
                  }}
                />
              </div>
              <button
                className="cursor-pointer bg-transparent"
                onClick={showEmojiesPickerHandler}
              >
                <MdOutlineAddReaction size={25} />
              </button>
              <Drawer>
              <button className="cursor-pointer bg-transparent">
                <MdOutlineChatBubbleOutline size={25} />
              </button>
                </Drawer>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
