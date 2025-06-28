import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function CallingDialog({ title, name, avatarImg, triggerBtn, footer }) {
  return (
    <Dialog>


        {triggerBtn}

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex justify-center">{ title }</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col justify-center items-center mt-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={avatarImg} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="mt-2 font-semibold text-2xl text-white tracking-widest">
            { name }
          </span>
        </div>

          <DialogFooter className="!justify-center">
            {footer}
          </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}
