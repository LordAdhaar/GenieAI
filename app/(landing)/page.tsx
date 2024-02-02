import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";


const LandingPage = () => {
    return (
        <div>
            LandingPage (Unprotected)
            <div>
                <Link href="/sign-in">
                    <Button variant="outline">Login</Button>
                </Link>
                <Link href="/sign-up">
                    <Button variant="outline">Register</Button>
                </Link>
            </div>
        </div>
    )
}

export default LandingPage;