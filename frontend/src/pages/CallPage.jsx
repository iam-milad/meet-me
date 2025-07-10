import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { IoMdMic, IoMdMicOff } from "react-icons/io";
import { BiCamera, BiCameraOff } from "react-icons/bi";
import { LuScreenShare, LuScreenShareOff } from "react-icons/lu";
import {
  MdCallEnd,
  MdOutlineAddReaction,
  MdOutlineChatBubbleOutline,
} from "react-icons/md";
import { BsRecordCircle, BsStopCircleFill } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";

import Drawer from "../components/ChatDrawer";
import CopyableText from "../components/CopyableText";
import ToggleIconButton from "../components/ToggleIconButton";
import LocalVideoPreview from "../components/LocalVideoPreview";
import RemoteVideoPreview from "../components/RemoteVideoPreview";

import { io } from "socket.io-client";
import { registerSocketEvents } from "../lib/socket/wss.js";
import * as webRTCHandler from "../lib/socket/webRTCHandler.js";
import * as constants from "../lib/socket/constants.js";

import { setDialog } from "../store/callSlice";

const socket = io("http://localhost:8080");
const defaultConstraints = {
  audio: false,
  video: true,
};

const CallPage = () => {
  const [isMicActive, setIsMicActive] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(true);
  const [isRecording, setIsRecording] = useState(true);
  const [showImojiesPicker, setShowEmojiesPicker] = useState(false);
  const [localStream, setLocalStream] = useState("");

  const dispatch = useDispatch();
  const socketId = useSelector((state) => state.call.socketId);
  const callInitiator = useSelector((state) => state.call.callInitiator);

  useEffect(() => {
    registerSocketEvents(socket, dispatch);

    let activeStream; // created this extra var to avoid passing localStream to dependency array
    navigator.mediaDevices
      .getUserMedia(defaultConstraints)
      .then((stream) => {
        activeStream = stream;
        setLocalStream(stream);
        webRTCHandler.setLocalStream(stream);
      })
      .catch((err) => {
        console.log("Error occurred when trying to get access to camera");
        console.error(err);
      });

      if(!callInitiator.isHost) {
        const callType = callInitiator.onlyAudio
        ? constants.callType.CHAT_PERSONAL_CODE
        : constants.callType.VIDEO_PERSONAL_CODE;
  
      dispatch(
        setDialog({
          show: true,
          type: constants.dialogTypes.CALLER_DIALOG,
          title: "Calling ",
          description: null,
        })
      );
      webRTCHandler.sendPreOffer(callType, callInitiator.personalCode);
      }

    return () => {
      socket.off("pre-offer");
      socket.off("webRTC-signaling");
      // Clean up the stream if it exists
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [dispatch, callInitiator.isHost, callInitiator.personalCode, callInitiator.onlyAudio]);

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
        <CopyableText text={socketId} />

        <RemoteVideoPreview />
        <LocalVideoPreview stream={localStream} />

        <div className="flex justify-center">
          <div className="flex absolute w-[350px] md:w-[390px] h-[75px] bottom-[80px] md:bottom-[100px] justify-between items-center">
            <ToggleIconButton
              isActive={isMicActive}
              onClick={toggleMic}
              ActiveIcon={IoMdMic}
              InactiveIcon={IoMdMicOff}
            />
            <ToggleIconButton
              isActive={isCameraActive}
              onClick={toggleCamera}
              ActiveIcon={BiCamera}
              InactiveIcon={BiCameraOff}
            />
            <button className="w-[75px] h-[75px] rounded-[75px] bg-[#fc5d5b] transition duration-300 flex justify-center items-center cursor-pointer">
              <MdCallEnd size={30} className="text-white" />
            </button>
            <ToggleIconButton
              isActive={isScreenSharing}
              onClick={toggleScreenSharing}
              ActiveIcon={LuScreenShare}
              InactiveIcon={LuScreenShareOff}
            />
            <ToggleIconButton
              isActive={isRecording}
              onClick={toggleRecording}
              ActiveIcon={BsRecordCircle}
              InactiveIcon={BsStopCircleFill}
              iconClassName="text-red-500"
            />
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

export default CallPage;
