import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaPhone } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { FaVideo } from "react-icons/fa";
import { BsCopy } from "react-icons/bs";

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const HomePage = () => {
  return (
    <div className="main-container h-screen grid grid-cols-[20%_60%_20%]">
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
          <div class="flex justify-between">
            <p class="text-xl font-bold">g45h3h543g5</p>
            <button
              size="icon"
              type="button"
              className="bg-white text-gray-800 font-bold cursor-pointer p-2 rounded-md"
            >
              <BsCopy />
            </button>
          </div>
        </div>

        <div className="grid gap-2 text-white mt-9">
          <Label htmlFor="personal-code">Personal Code</Label>
          <input id="personal-code" type="text" className="bg-white/20 ring-1 ring-black/5 rounded-sm text-gray-600 p-2 px-3"/>
        </div>

        <div className="flex w-full gap-2 mt-6">
          <Button
            variant="outline"
            size="lg"
            type="button"
            className="flex-1 truncate cursor-pointer"
          >
            <FaPhone /> Call
          </Button>
          <Button
            variant="outline"
            size="lg"
            type="button"
            className="flex-1 truncate cursor-pointer"
          >
            <FaVideo /> Video Call
          </Button>
        </div>
      </section>

      <section className="call-container bg-gray-100">
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
                <span className="text-3xl font-semibold">{index + 1}</span>
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
        <div className="video-preview">Video</div>
      </section>

      <section className="chat-container bg-green-200">Chat</section>
    </div>
  );
};

export default HomePage;
