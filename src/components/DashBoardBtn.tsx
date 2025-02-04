"use client";
// This component is only available for the interviewer but the candidate does not have access to this shit.
import Link from "next/link";
import { Button } from "./ui/button";
import { SparklesIcon } from "lucide-react";
import useUserRole from "@/hooks/useUserRole";

function DashboardBtn() {
  const { isCandidate, isLoading } = useUserRole();

  if (isCandidate || isLoading) return null;

  return (
    <Link href={"/dashboard"}>
      <Button className="gap-2 font-medium" size={"sm"}>
        <SparklesIcon className="size-4" />
        Dashboard
      </Button>
    </Link>
  );
  //   return <div>DashBoard Button</div>;
}
export default DashboardBtn;
