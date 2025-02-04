import { UserCircleIcon } from "lucide-react";
import { Doc } from "../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// This right here is a convex syntax to get a variable with all the fields of a table according to the schema basically.
type User = Doc<"users">;

function UserInfo({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="size-4">
        <AvatarImage src={user.image} />
        <AvatarFallback>
          <UserCircleIcon className="size-4" />
        </AvatarFallback>
      </Avatar>
      <span>{user.name}</span>
    </div>
  );
}
export default UserInfo;
