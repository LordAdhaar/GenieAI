import Heading from "@/components/heading"
import { checkSubscription } from "@/lib/subscription"
import { Settings } from "lucide-react"
import { SubscriptionButton } from "@/components/subscription-button";

export default async function SettingsPage(){

    const isPro = await checkSubscription();


    return (
        <div>
            <Heading
             title="Settings"
             description="Manage your account settings"
             icon = {Settings}
             iconColor="text-gray-700"
             bgColor="bg-gray-700/10"
            />
                <div className="px-4 lg:px-8 space-y-4">
                    <div className="text-muted-foreground text-sm">
                        {isPro ? "You are on a pro plan" : "You are on a free plan"}

                    </div>
                <SubscriptionButton isPro={isPro}/>
                </div>
        </div>
    )
}