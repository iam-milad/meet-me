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

export function CallingDialog() {
  const dialog = useSelector((state) => state.call.dialog);
  const dispatch = useDispatch();

  const closeDialog = () => {
    dispatch(
      setDialog({
        show: false,
        type: null,
        title: null,
      })
    );
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
          <span className="mt-2 font-semibold text-2xl text-gray-500 tracking-widest">
            Milad Nouri
          </span>
        </div>

        {dialog.type === dialogTypes.CALLEE_DIALOG ? (
          <DialogFooter className="!justify-center">
            <Button
              className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white cursor-pointer"
              variant="outline"
            >
              <MdCall /> Accept
            </Button>

            <Button
              className="bg-red-500 text-white hover:bg-red-600 hover:text-white cursor-pointer"
              variant="outline"
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
        )}
      </DialogContent>
    </Dialog>
  );
}
