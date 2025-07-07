import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MdCall } from "react-icons/md";
import { MdCallEnd } from "react-icons/md";
import { FaVideo } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector, useDispatch } from "react-redux";
import { dialogTypes } from "../lib/socket/constants.js";
import { setDialog } from "../store/callSlice";

import * as webRTCHandler from "../lib/socket/webRTCHandler.js";

export function CallingDialog() {
  const dialog = useSelector((state) => state.call.dialog);
  const dispatch = useDispatch();

  const closeDialog = () => {
    dispatch(
      setDialog({
        show: false,
        type: null,
        title: null,
        description: null,
      })
    );
  };

  const acceptCallHandler = () => {
    webRTCHandler.acceptCallHandler();
    closeDialog();
  };

  const rejectCallHandler = () => {
    webRTCHandler.rejectCallHandler();
    closeDialog();
  };

  return (
    <Dialog open={dialog.show} onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex justify-center">
            {dialog.title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col justify-center items-center mt-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {dialog.type !== dialogTypes.CALLER_REJECTION_DIALOG ? (
            <span className="mt-2 font-semibold text-2xl text-gray-500 tracking-widest">
              Milad Nouri
            </span>
          ) : (
            <span className="mt-2 font-semibold text-gray-500 tracking-widest">
              {dialog.description}
            </span>
          )}
        </div>

        {dialog.type !== dialogTypes.CALLER_REJECTION_DIALOG &&
          (dialog.type === dialogTypes.CALLEE_DIALOG ? (
            <DialogFooter className="!justify-center">
              <Button
                className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white cursor-pointer"
                variant="outline"
                onClick={acceptCallHandler}
              >
                <MdCall /> Accept
              </Button>

              <Button
                className="bg-red-500 text-white hover:bg-red-600 hover:text-white cursor-pointer"
                variant="outline"
                onClick={rejectCallHandler}
              >
                <MdCallEnd /> Reject
              </Button>
            </DialogFooter>
          ) : (
            <DialogFooter className="!justify-center">
              <Button
                className="bg-red-500 text-white hover:bg-red-600 hover:text-white cursor-pointer"
                variant="outline"
              >
                <FaVideo /> Cancel Call
              </Button>
            </DialogFooter>
          ))}
      </DialogContent>
    </Dialog>
  );
}
