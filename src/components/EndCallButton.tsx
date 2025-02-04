import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import React from "react";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import toast from "react-hot-toast";

export default function EndCallButton() {
  const router = useRouter();
  const call = useCall();
  const { useLocalParticipant } = useCallStateHooks();
  // current user in the call which is the user that is authenticated in the website
  const localParticipant = useLocalParticipant();
  const updateInterviewStatus = useMutation(
    api.interviews.updateInterviewStatus
  );
  const interview = useQuery(api.interviews.getInterviewByStreamCallId, {
    streamCallId: call?.id || "",
  });
  if (!call || !interview) return null;
  const isMeetingOwner = localParticipant?.userId === call.state.createdBy?.id;
  if (!isMeetingOwner) return null;
  const endCall = async () => {
    try {
      await call.endCall();
      await updateInterviewStatus({
        id: interview._id,
        status: "completed",
      });
      router.push("/");
      toast.success("meeting ended for everyone ! ");
    } catch (error) {
      console.error(error);
      toast.error("failed to end meeting");
    }
  };
  return (
    <Button variant={"destructive"} onClick={endCall}>
      End Meeting
    </Button>
  );
}
