import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { IoMdMic, IoMdMicOff } from "react-icons/io";
import { BiCamera, BiCameraOff } from "react-icons/bi";
import { LuScreenShare, LuScreenShareOff } from "react-icons/lu";
import { FaPause } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
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
import CallingDialog from "../components/CallingDialog.jsx";

import { io } from "socket.io-client";
import { registerSocketEvents } from "../lib/socket/wss.js";
import * as webRTCHandler from "../lib/socket/webRTCHandler.js";
import * as constants from "../lib/socket/constants.js";

import { setDialog, setSocketId } from "../store/callSlice";

const defaultConstraints = {
  audio: false,
  video: true,
};

const CallPage = () => {
  const [isMicActive, setIsMicActive] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [isRecording, setIsRecording] = useState(true);
  const [showImojiesPicker, setShowEmojiesPicker] = useState(false);
  const [localStream, setLocalStream] = useState("");
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socketId = useSelector((state) => state.call.socketId);
  const callInitiator = useSelector((state) => state.call.callInitiator);
  const screenSharingActive = useSelector((state) => state.call.screenSharingActive);

  useEffect(() => {
    const socket = io("http://localhost:8080");
    registerSocketEvents(socket).then((connectedSocket) => {
      dispatch(setSocketId(connectedSocket.id));
      webRTCHandler.setDispatch(dispatch);
    });

    return () => {
      socket.off("pre-offer");
      socket.off("webRTC-signaling");
    };
  }, [dispatch]);

  useEffect(() => {
    if (!socketId) return;

    let activeStream;
    const setupMediaAndCall = async () => {
      try {
        activeStream = await navigator.mediaDevices.getUserMedia(
          defaultConstraints
        );
        setLocalStream(activeStream);
        webRTCHandler.setLocalStream(activeStream);

        if (!callInitiator.isHost) {

          if(!callInitiator.personalCode) {
            return navigate("/");
          }

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

          console.log("before send");

          webRTCHandler.sendPreOffer(callType, callInitiator.personalCode);
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    };

    setupMediaAndCall();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [
    callInitiator.isHost,
    callInitiator.personalCode,
    callInitiator.onlyAudio,
    navigate,
    socketId,
    dispatch
  ]);

  const toggleMic = () => {
    setIsMicActive((prev) => !prev);
  };

  const toggleCamera = () => {
    setIsCameraActive((prev) => !prev);
  };

  const toggleScreenSharing = () => {
    webRTCHandler.switchBetweenCameraAndScreenSharing(screenSharingActive);
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

  const hangUpHandler = () => {
    webRTCHandler.handleHangUp();
  }

  return (
    <main className="h-screen">
      <CallingDialog />
      <section className="relative w-full h-screen">
        <CopyableText text={socketId} />

        <Button className="w-[160px] bg-transpatent text-white flex justify-around items-center py-5 border-1 rounded-xl absolute right-3 md:right-12 top-16 z-20 hover:bg-blue-500 cursor-pointer">
          <FaPlay />
          <span>Stop Recording</span>
        </Button>

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
            <button onClick={hangUpHandler} className="w-[75px] h-[75px] rounded-[75px] bg-[#fc5d5b] transition duration-300 flex justify-center items-center cursor-pointer">
              <MdCallEnd size={30} className="text-white" />
            </button>
            <ToggleIconButton
              isActive={screenSharingActive}
              onClick={toggleScreenSharing}
              InactiveIcon={LuScreenShare}
              ActiveIcon={LuScreenShareOff}
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
