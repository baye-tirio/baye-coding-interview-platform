//This is a hook that gives us the call typeshit mainnn.
import { useEffect, useState } from "react";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
const useGetCallById = (id: string | string[]) => {
  const [call, setCall] = useState<Call>();
  const [isCallLoading, setIsCallLoading] = useState<boolean>(true);
  const client = useStreamVideoClient();
  useEffect(() => {
    if (!client) return;
    const getCall = async () => {
     console.log("In the getCall function trying to get the call of the id ", id);
      try {
        const { calls } = await client.queryCalls({
          filter_conditions: {
            id,
          },
        });
        if (calls.length > 0) setCall(calls[0]);
      } catch (error) {
        console.error(error);
        setCall(undefined);
      } finally {
        console.log("We finally have a call and the call is : ");
        console.log(call);
        setIsCallLoading(false);
      }
    };
    //let's call the function to get the call. typeshit.
    getCall();
  }, [client, id]);
  return { call, isCallLoading };
};
export default useGetCallById;
