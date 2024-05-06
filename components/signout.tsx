import { SignOutButton } from "@clerk/nextjs";

export default function SignOut() {
  return (
    <div>
      <SignOutButton redirectUrl="/signin" />
    </div>
  );
}
