"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useMeetingActions from "@/hooks/useMeetingActions";
import { useState } from "react";
interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  isJoiningMeeting: boolean;
}

export function MeetingModal({
  isOpen,
  onClose,
  title,
  isJoiningMeeting,
}: MeetingModalProps) {
  const [meetingUrl, setMeetingUrl] = useState("");
  const { createIstantMeeting, joinMeeting } = useMeetingActions();

  const handleStart = async () => {
    if (isJoiningMeeting) {
      const meetingId = meetingUrl.split("/").pop();
      if (meetingId) joinMeeting(meetingId);
    } else {
      await createIstantMeeting();
    }
    //reset everything
    setMeetingUrl("");
    //close the modal
    onClose();
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          {isJoiningMeeting && (
            <Input
              placeholder="Paste meeting link here ..."
              value={meetingUrl}
              onChange={(e) => setMeetingUrl(e.target.value)}
            />
          )}
          <div className="flex justify-end gap-3 ">
            <Button variant={"outline"} onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleStart}
              disabled={isJoiningMeeting && !meetingUrl.trim()}
            >
              {isJoiningMeeting ? "Join Meeting" : "Start Meeting"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
