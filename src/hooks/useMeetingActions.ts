import { useRouter } from "next/navigation";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import toast from "react-hot-toast";
const useMeetingActions = () => {
  const router = useRouter();
  const client = useStreamVideoClient();
  const createIstantMeeting = async () => {
    if (!client) return;
    try {
      //let's get a random id for the user
      const id = crypto.randomUUID();
      // create a call for the instant call
      const call = client.call("default", id);
      await call.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
          custom: {
            description: "Instant Meeting",
          },
        },
      });
      //Once the call has been created take the user to the meeting page
      router.push(`/meeting/${call.id}`);
      toast.success("Meeting Created");
    } catch (error) {
      console.log(error);
      toast.error("Error creating an instant call");
    }
  };
  const joinMeeting = (callId: string) => {
    if (!client) return toast.error("failed to join meeting Please try again.");
    router.push(`/meeting/${callId}`);
  };

  return { createIstantMeeting, joinMeeting };
};
export default useMeetingActions;
