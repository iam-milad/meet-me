import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IoIosSend } from "react-icons/io";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ChatMessage from "./ChatMessage";

const Drawer = ({ children }) => {
  const messages = [
    { text: "Hi there!", isSender: false },
    { text: "Hey, How are you?", isSender: true },
    { text: "I am fine thank you, and you?", isSender: false },
    { text: "All good thank you", isSender: true },
    { text: "Nice", isSender: false },
    { text: "What you up to?", isSender: false },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Current Chat</SheetTitle>
          <SheetDescription>
            The chat here is temporary (i.e., it will not be saved into a
            database).
          </SheetDescription>
        </SheetHeader>

        <div className="chat-container bg-gray-100 w-full h-full flex flex-col gap-6 py-6 px-3 overflow-y-auto">
          {messages.map((msg, index) => (
            <ChatMessage
              key={index}
              message={msg.text}
              isSender={msg.isSender}
            />
          ))}
        </div>

        <SheetFooter>
          <div className="flex items-center gap-2">
            <Input />
            <Button className="cursor-pointer">
              <IoIosSend /> Send
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default Drawer;
