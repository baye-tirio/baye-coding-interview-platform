"use client";
import InterviewScheduleUI from "@/app/(root)/schedule/InterviewScheduleUI";
import LoaderUI from "@/components/LoaderUI";
import useUserRoles from "@/hooks/useUserRole";
import { useRouter } from "next/navigation";
import React from "react";

export default function SchedulePage() {
  const router = useRouter();
  const { isLoading, isInterviewer } = useUserRoles();
  if (isLoading) return <LoaderUI />;
  // if the user is not an interviewer then they cannot schedule a call
  if (!isInterviewer) router.push("/");
  return <InterviewScheduleUI />;
}
