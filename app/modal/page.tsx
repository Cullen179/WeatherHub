'use client'
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent, DialogTrigger
} from '@/components/ui/dialog';
import Modal from './modal';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function DialogDemo() {
  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (isOpen) {
          console.log("first")
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[60%] p-10">
        <ScrollArea className='h-[400px]'>
          <Modal />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
