import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UserInfo from "@/components/UserInfo";
import { Loader2Icon, XIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { TIME_SLOTS } from "@/constants";
import MeetingCard from "@/components/MeetingCard";

export default function InterviewScheduleUI() {
  // First let's get the stream video client
  const client = useStreamVideoClient();
  // Below hook comes from clerk and it's used to access the currently authenticated user from our application
  const { user } = useUser();
  // The state below is for opening or closing the modal
  const [open, setOpen] = useState<boolean>(false);
  // State for the loading state when we are creating the interview
  const [isCreating, setIsCreating] = useState<boolean>(false);
  // Now let's get all the interviews that we done created or had we gon use convex for this because they being pulled from convex
  const interviews = useQuery(api.interviews.getAllInterviews);
  const users = useQuery(api.users.getUsers);
  // a mutation to create and interview .. so we are creating this function so that we use it later to post to the convex database
  const createInterview = useMutation(api.interviews.createInterview);
  // fetch all them candidates this is utilized when you tryna add new interviewers to a call being scheduled
  const candidates = users?.filter((user) => user.role === "candidate");
  // fetch all them interviewers
  const interviewers = users?.filter((user) => user.role === "interviewer");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date(),
    time: "09:00",
    candidate: "",
    interviewerIds: user?.id ? [user.id] : [],
  });
  // function that would allow the scheduling of a meeting
  const scheduleMeeting = async () => {
    if (!client || !user) return;
    if (!formData.candidate || formData.interviewerIds.length === 0) {
      toast.error("Please select both candidate and at least one interviewer");
      return;
    }
    // now let's schedule the interview
    setIsCreating(true);
    try {
      const { title, description, date, time, candidate, interviewerIds } =
        formData;
      const [hours, minutes] = time.split(":");
      const meetingDate = new Date(date);
      meetingDate.setHours(parseInt(hours), parseInt(minutes), 0);
      //generate a random ID
      const id = crypto.randomUUID();
      //creating a default call and giving it a random id
      const call = client.call("default", id);
      await call.getOrCreate({
        data: {
          starts_at: meetingDate.toISOString(),
          custom: {
            description: title,
            additionalDetails: description,
          },
        },
      });
      // utilizing the mutation created earlier to post data to convex
      await createInterview({
        title,
        description,
        startTime: meetingDate.getTime(),
        status: "upcoming",
        streamCallId: id,
        candidateId: candidate,
        interviewerIds,
      });
      //close the modal
      setOpen(false);
      toast.success("meeting scheduled successfully");
      //reset the formData
      setFormData({
        title: "",
        description: "",
        date: new Date(),
        time: "09:00",
        candidate: "",
        interviewerIds: user?.id ? [user.id] : [],
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to schedule a meeting . try again !");
    } finally {
      setIsCreating(false);
    }
  };
  const addInterviewer = (interviewerId: string) => {
    if (!formData.interviewerIds.includes(interviewerId)) {
      setFormData((prevState) => ({
        ...prevState,
        interviewerIds: [interviewerId, ...prevState.interviewerIds],
      }));
    }
  };
  const removeInterviewer = (interviwerId: string) => {
    if (interviwerId === user?.id) return;
    setFormData((prevState) => ({
      ...prevState,
      interviewerIds: prevState.interviewerIds.filter(
        (id) => id !== interviwerId
      ),
    }));
  };
  // Basically the interviewers selected for the call typeshit.
  const selectedInterviewers =
    interviewers?.filter((i) => formData.interviewerIds.includes(i.clerkId)) ??
    [];
  const availableInterviewers =
    interviewers?.filter((i) => !formData.interviewerIds.includes(i.clerkId)) ??
    [];
  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        {/* HEADER INFO */}
        <div>
          <h1 className="text-3xl font-bold">Interviews</h1>
          <p className="text-muted-foreground mt-1">
            Schedule and manage interviews
          </p>
        </div>
        {/* DIALOG COMPONENT */}
        {/* that openChange right there means its going to set the open variable accordingly because there are many different ways of opening and closing modals */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size={"lg"}>Schedule Interview</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] h-[calc(100vh-200px)] overflow-auto">
            <DialogHeader>
              <DialogTitle>Schedule Interiview</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* INTERVIEW TITLE */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="Interview title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              {/* INTERVIEW DESCRIPTION */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Interview description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
              {/* CANDIDATE */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Candidate</label>
                <Select
                  value={formData.candidate}
                  onValueChange={(candidateId) =>
                    setFormData({ ...formData, candidate: candidateId })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select candidate" />
                  </SelectTrigger>
                  <SelectContent>
                    {candidates?.map((candidate) => (
                      <SelectItem
                        key={candidate.clerkId}
                        value={candidate.clerkId}
                      >
                        <UserInfo user={candidate} />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* INTERVIEWERS */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Interviewers</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedInterviewers?.map((interviewer) => (
                    <div
                      key={interviewer.clerkId}
                      className="inline-flex items-center gap-2 bg-secondary px-2 py-1 rounded-md text-sm"
                    >
                      <UserInfo user={interviewer} />
                      {interviewer.clerkId !== user?.id && (
                        <button
                          onClick={() => removeInterviewer(interviewer.clerkId)}
                          className="hover:text-destructive transition-colors"
                        >
                          <XIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {availableInterviewers.length > 0 && (
                  <Select onValueChange={addInterviewer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add interviewer" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableInterviewers.map((interviewer) => (
                        <SelectItem
                          key={interviewer.clerkId}
                          value={interviewer.clerkId}
                        >
                          <UserInfo user={interviewer} />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* DATE & TIME */}
              <div className="flex gap-4">
                {/* CALENDAR */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) =>
                      date && setFormData({ ...formData, date })
                    }
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </div>
                {/* TIME */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time</label>
                  <Select
                    value={formData.time}
                    onValueChange={(time) => setFormData({ ...formData, time })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* ACTION BUTTONS */}
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={scheduleMeeting} disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <Loader2Icon className="mr-2 size-4 animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    "Schedule Interview"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {/* LOADING STATE & MEETING CARDS THE MEETINGS THAT HAVE DONE BEEN SCHEDULED REGARDLESS OF THEIR STATUS*/}
      {!interviews ? (
        <div className="flex justify-center py-12">
          <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : interviews.length > 0 ? (
        <div className="spacey-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {interviews.map((interview) => (
              <MeetingCard key={interview._id} interview={interview} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          No interviews scheduled
        </div>
      )}
    </div>
  );
}
