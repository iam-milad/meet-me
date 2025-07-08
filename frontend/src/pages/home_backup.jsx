import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FaVideo } from "react-icons/fa";
import { MdCall } from "react-icons/md";
import { MdCallEnd } from "react-icons/md";
import { Label } from "@/components/ui/label";
import { IoIosChatbubbles } from "react-icons/io";
import { PiCopyLight } from "react-icons/pi";
import { CiCircleCheck } from "react-icons/ci";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { CallingDialog } from "../components/CallingDialog";
import LocalVideo from "../components/LocalVideo.jsx";
import { io } from "socket.io-client";
import { registerSocketEvents } from "../lib/socket/wss.js";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setDialog } from "../store/callSlice";

import * as webRTCHandler from "../lib/socket/webRTCHandler.js";
import * as constants from "../lib/socket/constants.js";

const socket = io("http://localhost:8080");
const defaultConstraints = {
  audio: false,
  video: true,
};

const HomePage = () => {
  const dispatch = useDispatch();
  const socketId = useSelector((state) => state.call.socketId);
  const callState = useSelector((state) => state.call.callState);
  const remoteStream = useSelector((state) => state.call.remoteStream);
  const screenSharingActive = useSelector((state) => state.call.screenSharingActive);
  const [personalCodeCopied, setPersonalCodeCopied] = useState(false);
  const [personalCode, setPersonalCode] = useState("");
  const [localStream, setLocalStream] = useState("");


  useEffect(() => {
    console.log("outside of hook")
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

    return () => {
      //   socket.disconnect();
      socket.off("pre-offer");
      socket.off('webRTC-signaling'); 
      // Clean up the stream if it exists
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [dispatch]);

  const copyPersonalCodeHandler = () => {
    navigator.clipboard && navigator.clipboard.writeText(socketId);
    setPersonalCodeCopied(true);
    setTimeout(() => setPersonalCodeCopied(false), 2000);
  };

  const sendPreOfferHandler = (callType) => {
    dispatch(
      setDialog({
        show: true,
        type: constants.dialogTypes.CALLER_DIALOG,
        title: "Calling ",
        description: null,
      })
    );
    webRTCHandler.sendPreOffer(callType, personalCode);
  };

  const switchBetweenCameraAndScreenSharingHandler = () => {
    webRTCHandler.switchBetweenCameraAndScreenSharing(screenSharingActive);
  }

  const hangUpHandler = () => {
    webRTCHandler.handleHangUp();
  }

  return (
    <main className="main-container h-screen grid grid-cols-[20%_60%_20%]">
      <section className="profile h-ful px-6 bg-linear-to-t from-sky-500 to-indigo-500">
        <div className="flex flex-col justify-center items-center mt-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="mt-2 font-semibold text-2xl text-white tracking-widest">
            Milad nouri
          </span>
        </div>
        <p className="mt-12 text-gray-100">
          Talk with other user by passing his personal code or talk with
          strangers!
        </p>
        <div className="text-gray-100 rounded-xl px-6 py-4 mt-3 bg-white/20 ring-1 ring-black/5">
          <p className="mb-3">Your personal code</p>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <p className="text-md font-bold">{socketId}</p>
            <button
              size="icon"
              type="button"
              className="bg-white text-gray-800 font-bold cursor-pointer p-2 rounded-md"
              onClick={copyPersonalCodeHandler}
            >
              {personalCodeCopied ? <CiCircleCheck /> : <PiCopyLight />}
            </button>
          </div>
        </div>

        <div className="grid gap-2 text-white mt-9">
          <Label htmlFor="personal-code">Personal Code</Label>
          <input
            id="personal-code"
            type="text"
            className="bg-white/20 ring-1 ring-black/5 rounded-sm text-gray-100 p-2 px-3"
            onChange={(e) => setPersonalCode(e.target.value)}
          />
        </div>

        <div className="flex w-full gap-2 mt-6">
          <Button
            variant="outline"
            size="lg"
            type="button"
            className="flex-1 truncate cursor-pointer"
            onClick={() =>
              sendPreOfferHandler(constants.callType.CHAT_PERSONAL_CODE)
            }
          >
            <IoIosChatbubbles /> Chat
          </Button>
          <Button
            variant="outline"
            size="lg"
            type="button"
            className="flex-1 truncate cursor-pointer"
            onClick={() =>
              sendPreOfferHandler(constants.callType.VIDEO_PERSONAL_CODE)
            }
          >
            <FaVideo /> Video Call
          </Button>
          <CallingDialog />
        </div>
      </section>

      <section className="call-container bg-gray-100 flex flex-col">
        <div className="w-full h-40 bg-gray-100 py-3 px-16 flex items-center">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent className="h-full">
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem
                  key={index}
                  className="basis-1/1 sm:basis-1/1 md:basis-1/2 lg:basis-1/2 xl:basis-1/3 2xl:basis-1/4"
                >
                  <div className="p-3">
                    <Card className="p-0">
                      <LocalVideo stream={localStream} />
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        {/* callState === constants.callState.CALL_AVAILABLE  */}
        <div className="videos-container bg-gray-50 h-full">
            <div className="h-full">
              <video
                id="remote_video"
                className="w-full h-full"
                muted
                autoPlay
              ></video>
              <div className="flex call_buttons_container absolute w-[395px] h-[75px] bottom-[40px] left-[calc(50%-200px)] justify-between items-center">
                <button
                  className="w-[50px] h-[50px] bg-[rgba(0,0,0,0.2)] rounded-[50px] transition duration-300 flex justify-center items-center"
                  id="mic_button"
                >
                  <img src="images/mic.png" id="mic_button_image"></img>
                </button>
                <button
                  className="w-[50px] h-[50px] bg-[rgba(0,0,0,0.2)] rounded-[50px] transition duration-300 flex justify-center items-center"
                  id="camera_button"
                >
                  <img src="images/camera.png" id="camera_button_image"></img>
                </button>
                <button
                  className="w-[75px] h-[75px] rounded-[75px] bg-[#fc5d5b] transition duration-300 flex justify-center items-center"
                  id="hang_up_button"
                  onClick={hangUpHandler}
                >
                  <img src="images/hangUp.png"></img>
                </button>
                <button
                  className="w-[50px] h-[50px] bg-[rgba(0,0,0,0.2)] rounded-[50px] transition duration-300 flex justify-center items-center"
                  id="screen_sharing_button"
                  onClick={switchBetweenCameraAndScreenSharingHandler}
                >
                  <img src="images/switchCameraScreenSharing.png"></img>
                </button>
                <button
                  className="w-[50px] h-[50px] bg-[rgba(0,0,0,0.2)] rounded-[50px] transition duration-300 flex justify-center items-center"
                  id="start_recording_button"
                >
                  <img src="images/recordingStart.png"></img>
                </button>
              </div>
              <div
                className="finish_chat_button_container hidden"
                id="finish_chat_button_container"
              >
                <button
                  className="call_button_large"
                  id="finish_chat_call_button"
                >
                  <img src="images/hangUp.png"></img>
                </button>
              </div>
              <div
                className="video_recording_buttons_container hidden"
                id="video_recording_buttons"
              >
                <button id="pause_recording_button">
                  <img src="./utils/images/pause.png"></img>
                </button>
                <button id="resume_recording_button" className="hidden">
                  <img src="./utils/images/resume.png"></img>
                </button>
                <button id="stop_recording_button">Stop recording</button>
              </div>
            </div>


            <div className="flex items-center justify-center h-full w-full">
              <img className="w-[300px]" src="images/logo.png"></img>
            </div>
        </div>
      </section>

      <section className="chat-container bg-green-200">Chat</section>
    </main>
  );
};

export default HomePage;

