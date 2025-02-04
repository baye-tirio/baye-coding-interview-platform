"use client";
import { ReactNode, useEffect, useState } from "react";
import { StreamVideoClient, StreamVideo } from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";
import LoaderUI from "../LoaderUI";
import { StreamTokenProvider } from "@/actions/stream.actions";

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [streamVideoClient, setStreamVideoClient] =
    useState<StreamVideoClient>();
  //useUser is a hook from clerk that returns the authenticated user in our application
  const { user, isLoaded } = useUser();

  useEffect(() => {
    // no need to create a stream client if we have no user yet
    if (!isLoaded || !user) return;
    const client = new StreamVideoClient({
      apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
      user: {
        id: user?.id,
        name: user?.firstName || "" + " " + user?.lastName || "" || user?.id,
        image: user?.imageUrl,
      },
      tokenProvider: StreamTokenProvider,
    });
    setStreamVideoClient(client);
  }, [user, isLoaded]);
  if (!streamVideoClient) return <LoaderUI />;
  return <StreamVideo client={streamVideoClient}>{children}</StreamVideo>;
};
export default StreamVideoProvider;
