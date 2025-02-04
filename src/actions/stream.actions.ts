"use server";
//server actions are functions that run on node on the server ruther than on the browser's javascript engine
import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";
export const StreamTokenProvider = async () => {
  const user = await currentUser();
  if (!user) throw new Error("User not authenticated!");
  const streamClient = new StreamClient(
    process.env.NEXT_PUBLIC_STREAM_API_KEY!,
    process.env.STREAM_SECRET_KEY!
  );
  //By default it would expire after one hour but you can adjust it accordingly typeshit
  const token = streamClient.generateUserToken({
    user_id: user.id,
  });
  return token;
};
