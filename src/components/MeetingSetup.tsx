"use client";
import {
  DeviceSettings,
  useCall,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import React, { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { CameraIcon, MicIcon, SettingsIcon } from "lucide-react";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";

export default function MeetingSetup({
  onSetupComplete,
}: {
  onSetupComplete: () => void;
}) {
  const [isCameraDisabled, setIsCameraDisabled] = useState<Boolean>(true);
  const [isMicrophoneDisabled, setIsMicrophoneDisabled] =
    useState<Boolean>(false);
  // We can get this because of the StreamCall component that we are utilizing
  const call = useCall();
  if (!call) return null;
  // basically disable or enable the camera depending on whether on what the user decides on the screen
  useEffect(() => {
    if (isCameraDisabled) call.camera.disable();
    else call.camera.enable();
  }, [isCameraDisabled, call.camera]);
  // basically enable or disable the microphone depending on what the user selects on the screen
  useEffect(() => {
    if (isMicrophoneDisabled) call.microphone.disable();
    else call.microphone.enable();
  }, [isMicrophoneDisabled, call.microphone]);

  const handleJoinMeeting = async () => {
    await call.join();
    // basically setup the join meeting variable to true on the parent component so that we can now join the meeting after setting up the camera and microphone
    onSetupComplete();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background/95">
      <div className="w-full max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* VIDEO PREVIEW CONTAINER COMPONENT  */}
          <Card className="md:col-span-1 p-6 flex flex-col">
            <div>
              <h1 className="text-xl font-semibold mb-1">Camera Preview</h1>
              <p className="text-sm text-muted-foreground">
                Make sure you look good!
              </p>
            </div>

            {/* VIDEO PREVIEW */}
            <div className="mt-4 flex-1 min-h-[400px] rounded-xl overflow-hidden bg-muted/50 border relative">
              <div className="absolute inset-0">
                <VideoPreview className="h-full w-full" />
              </div>
            </div>
          </Card>
          {/* CARD CONTROLS */}

          <Card className="md:col-span-1 p-6">
            <div className="h-full flex flex-col">
              {/* MEETING DETAILS  */}
              <div>
                <h2 className="text-xl font-semibold mb-1">Meeting Details</h2>
                <p className="text-sm text-muted-foreground break-all">
                  {call.id}
                </p>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-6 mt-8">
                  {/* CAM CONTROL */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <CameraIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Camera</p>
                        <p className="text-sm text-muted-foreground">
                          {isCameraDisabled ? "Off" : "On"}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={!isCameraDisabled}
                      onCheckedChange={(checked) =>
                        setIsCameraDisabled(!checked)
                      }
                    />
                  </div>

                  {/* MIC CONTROL */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <MicIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Microphone</p>
                        <p className="text-sm text-muted-foreground">
                          {isMicrophoneDisabled ? "Off" : "On"}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={!isMicrophoneDisabled}
                      onCheckedChange={(checked) =>
                        setIsMicrophoneDisabled(!checked)
                      }
                    />
                  </div>

                  {/* DEVICE SETTINGS */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <SettingsIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Settings</p>
                        <p className="text-sm text-muted-foreground">
                          Configure devices
                        </p>
                      </div>
                    </div>
                    <DeviceSettings />
                  </div>
                </div>

                {/* JOIN BTN */}
                <div className="space-y-3 mt-8">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleJoinMeeting}
                  >
                    Join Meeting
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Do not worry, our team is super friendly! We want you to
                    succeed. 🎉
                  </p>
                </div>
              </div>
            </div>
          </Card>
          {/* END OF CONTROLS SECTION */}
        </div>
      </div>
    </div>
  );
}
