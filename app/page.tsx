import SignOut from "@/components/signout";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/authentication";
import { redirect } from "next/navigation";

export default async function Home() {
    const profile = await getCurrentUser()
    if (profile) {
        redirect(`/dashboard`)
    }
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">

            buy me zobo again
            
            {
                profile ?? <SignOut />
            }

            <Button>Click me</Button>
        </main>
    );
}
