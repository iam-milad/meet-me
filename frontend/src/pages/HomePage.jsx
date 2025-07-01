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
import { io } from "socket.io-client";
import { registerSocketEvents } from "../lib/socket/wss.js";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { sendPreOffer } from "../lib/socket/webRTCHandler.js";

const socket = io("http://localhost:8080");

const HomePage = () => {
  const dispatch = useDispatch();
  const socketId = useSelector((state) => state.call.socketId);
  const [personalCodeCopied, setPersonalCodeCopied] = useState(false);

  useEffect(() => {
    registerSocketEvents(socket, dispatch);

    // return () => {
    //   socket.disconnect();
    // };
  }, [dispatch]);

  const incomingCall = true;

  const copyPersonalCodeHandler = () => {
    navigator.clipboard && navigator.clipboard.writeText(socketId);
    setPersonalCodeCopied(true);
    setTimeout(() => setPersonalCodeCopied(false), 2000);
  };

  const sendPreOfferHandler = () => {
    sendPreOffer();
  };

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
          />
        </div>

        <div className="flex w-full gap-2 mt-6">
          <Button
            variant="outline"
            size="lg"
            type="button"
            className="flex-1 truncate cursor-pointer"
            onClick={sendPreOfferHandler}
          >
            <IoIosChatbubbles /> Chat
          </Button>
          <Button
            variant="outline"
            size="lg"
            type="button"
            className="flex-1 truncate cursor-pointer"
            onClick={sendPreOfferHandler}
          >
            <FaVideo /> Video Call
          </Button>

          {/* <CallingDialog
            title={incomingCall ? "Incoming Call" : "Calling"}
            avatarImg="https://github.com/shadcn.png"
            name="Milad Nouri"
            triggerBtn={
              <DialogTrigger
                variant="outline"
                size="lg"
                type="button"
                className="flex-1 truncate cursor-pointer"
                asChild
              >
                <Button variant="outline">
                  <FaVideo /> Video Call
                </Button>
              </DialogTrigger>
            }
            footer={
              incomingCall ? (
                <DialogFooter className="!justify-center">
                  <DialogClose asChild>
                    <Button
                      className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white cursor-pointer"
                      variant="outline"
                    >
                      <MdCall /> Accept
                    </Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      className="bg-red-500 text-white hover:bg-red-600 hover:text-white cursor-pointer"
                      variant="outline"
                    >
                      <MdCallEnd /> Reject
                    </Button>
                  </DialogClose>
                </DialogFooter>
              ) : (
                <DialogFooter className="!justify-center">
                  <DialogClose asChild>
                    <Button
                      className="bg-red-500 text-white hover:bg-red-600 hover:text-white cursor-pointer"
                      variant="outline"
                    >
                      <FaVideo /> Cancel Call
                    </Button>
                  </DialogClose>
                </DialogFooter>
              )
            }
          /> */}
        </div>
      </section>

      <section className="call-container bg-gray-100 flex flex-col">
        <div className="w-full h-40 bg-white px-16 flex items-center">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent>
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index} className="md:basis-1/4">
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex items-center justify-center p-6">
                        <span className="text-3xl font-semibold">
                          {index + 1}
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        <div className="videos-container bg-gray-50 h-full">
          <div className="flex items-center justify-center h-full">
            <img className="w-[300px]" src="images/logo.png"></img>
          </div>
          <video
            className="hidden remote_video w-full h-full bg-amber-300"
            muted
            autoPlay
          ></video>
          <div className="hidden call_buttons_container absolute w-[395px] h-[75px] bottom-[40px] left-[calc(50%-200px)] justify-between items-center">
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
            >
              <img src="images/hangUp.png"></img>
            </button>
            <button
              className="w-[50px] h-[50px] bg-[rgba(0,0,0,0.2)] rounded-[50px] transition duration-300 flex justify-center items-center"
              id="screen_sharing_button"
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
            <button className="call_button_large" id="finish_chat_call_button">
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
      </section>

      <section className="chat-container bg-green-200">Chat</section>
    </main>
  );
};

export default HomePage;
