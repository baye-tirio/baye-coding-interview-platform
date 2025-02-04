import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";

const useGetCalls = () => {
  const { user } = useUser();
  const client = useStreamVideoClient();
  //All them calls we done did
  const [calls, setCalls] = useState<Call[]>();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const loadCalls = async () => {
      if (!client || !user?.id) return;
      // start fetching them calls
      setIsLoading(true);
      try {
        //fetching them calls...... straight from the documentation
        const { calls } = await client.queryCalls({
          sort: [{ field: "starts_at", direction: -1 }],
          filter_conditions: {
            starts_at: { $exists: true },
            $or: [
              { created_by_user_id: user.id },
              { members: { $in: [user.id] } },
            ],
          },
        });
        //Once we got them calls then set the calls array
        setCalls(calls);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCalls();
  }, [client, user?.id]);
  const now = new Date();
  //Call is an interface that's why it works typeshit.
  const endedCalls = calls?.filter(({ state: { startsAt, endedAt } }: Call) => {
    return (startsAt && new Date(startsAt) < now) || !!endedAt;
  });
  //This is for them upcoming calls typeshit.
  const upcomingCalls = calls?.filter(({ state: { startsAt } }: Call) => {
    return startsAt && new Date(startsAt) > now;
  });
  //Them live calls
  const liveCalls = calls?.filter(({ state: { startsAt, endedAt } }: Call) => {
    return startsAt && new Date(startsAt) < now && !endedAt;
  });
  return { calls, endedCalls, upcomingCalls, liveCalls, isLoading };
};
export default useGetCalls;
