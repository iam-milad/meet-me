import { useEffect, useState, useMemo } from "react";
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
import {
  startRecording,
  stopRecording,
  resumeRecording,
  pauseRecording,
} from "../lib/recordingUtils.js";
import MediaStreamManager from "../lib/MediaStreamManager.js";

import { setDialog, setSocketId } from "../store/callSlice";

const CallPage = () => {
  const [isMicActive, setIsMicActive] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [recording, setRecording] = useState({
    isActive: false,
    state: constants.recordingState.STOPPED
  });
  const [showImojiesPicker, setShowEmojiesPicker] = useState(false);
  const [localStream, setLocalStream] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socketId = useSelector((state) => state.call.socketId);
  const callInitiator = useSelector((state) => state.call.callInitiator);
  const callState = useSelector((state) => state.call.callState);
  const peerConnected = useSelector((state) => state.call.peerConnected);
  const screenSharingActive = useSelector(
    (state) => state.call.screenSharingActive
  );

  const defaultConstraints = useMemo(() => ({
    audio: false,
    video: callState !== constants.callState.CALL_AVAILABLE_ONLY_AUDIO && callState !== constants.callState.CALL_UNAVAILABLE,
  }), [callState]);

  useEffect(() => {
    const socket = io("http://localhost:8080");
    registerSocketEvents(socket).then((connectedSocket) => {
      dispatch(setSocketId(connectedSocket.id));
      webRTCHandler.setDispatch(dispatch);
    });

    return () => {
      socket.off("pre-offer");
      socket.off("webRTC-signaling");
      socket.off("user-hanged-up");
      socket.off("pre-offer-answer");
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
        MediaStreamManager.setLocalStream(activeStream);

        if (!callInitiator.isHost) {
          const callType = callState === constants.callState.CALL_AVAILABLE_ONLY_AUDIO
            ? constants.callType.AUDIO_PERSONAL_CODE
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
    navigate,
    socketId,
    dispatch,
    callState,
    defaultConstraints
  ]);

  const toggleMic = () => {
    webRTCHandler.toggleMic();
    setIsMicActive((prev) => !prev);
  };

  const toggleCamera = () => {
    webRTCHandler.toggleCamera();
    setIsCameraActive((prev) => !prev);
  };

  const toggleScreenSharing = () => {
    webRTCHandler.switchBetweenCameraAndScreenSharing(screenSharingActive);
  };

  const handleRecordingStartStop = () => {
    if (!recording.isActive) {
      setRecording({
        isActive: true,
        state: constants.recordingState.RECORDING
      });
      startRecording();
    } else {
      setRecording({
        isActive: false,
        state: constants.recordingState.STOPPED
      });
      stopRecording();
    }
  };

  const handleRecordingPauseResume = () => {
    if (recording.isActive && recording.state === constants.recordingState.RECORDING) {
      setRecording({
        isActive: true,
        state: constants.recordingState.PAUSED
      });
      pauseRecording();
    } else {
      setRecording({
        isActive: true,
        state: constants.recordingState.RESUMED
      });
      resumeRecording();
    }
  };

  const showEmojiesPickerHandler = () => {
    setShowEmojiesPicker((prev) => !prev);
  };

  const emojiClickHandler = (emoji) => {
    setShowEmojiesPicker(false);
  };

  const hangUpHandler = () => {
    webRTCHandler.handleHangUp();
    navigate("/");
  };

  return (
    <main className="h-screen">
      <CallingDialog />
      <section className="relative w-full h-screen">
        <CopyableText text={socketId} />

        {recording.isActive && <Button onClick={handleRecordingPauseResume} className="w-[160px] bg-transpatent text-white flex justify-around items-center py-5 border-1 rounded-xl absolute right-3 md:right-12 top-16 z-20 hover:bg-blue-500 cursor-pointer">
          { recording.state === constants.recordingState.PAUSED  ? <FaPlay /> : <FaPause />}
          <span>{recording.state === constants.recordingState.PAUSED ? "Start Recording" : "Stop Recording"}</span>
        </Button>}

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
            <button
              onClick={hangUpHandler}
              className="w-[75px] h-[75px] rounded-[75px] bg-[#fc5d5b] transition duration-300 flex justify-center items-center cursor-pointer"
            >
              <MdCallEnd size={30} className="text-white" />
            </button>
            <ToggleIconButton
              isActive={screenSharingActive}
              onClick={toggleScreenSharing}
              InactiveIcon={LuScreenShare}
              ActiveIcon={LuScreenShareOff}
              disabled={!peerConnected}
            />
            <ToggleIconButton
              isActive={recording.isActive}
              onClick={handleRecordingStartStop}
              InactiveIcon={BsRecordCircle}
              ActiveIcon={BsStopCircleFill}
              iconClassName="text-red-500"
              disabled={!peerConnected}
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
