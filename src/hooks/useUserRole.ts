import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const useUserRoles = () => {
  const { user } = useUser();
  const userData = useQuery(api.users.getUserByClerkId, {
    clerkId: user?.id || "",
  });
  // the value of userData is undefined if the user is loading
  const isLoading = userData === undefined;
  return {
    isCandidate: userData?.role === "candidate",
    isInterviewer: userData?.role === "interviewer",
    isLoading,
  };
};
export default useUserRoles;
