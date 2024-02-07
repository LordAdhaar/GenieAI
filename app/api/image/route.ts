import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

import  {increaseApiLimit, checkApiLimit} from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});

export async function POST(req: Request) {

  try {

    const { userId } = auth();
    const body = await req.json();
    const { prompt, amount = 1, resolution = "512x512" } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!openai.apiKey) {
      return new NextResponse("OpenAI API Key not configured", { status: 500 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    // Check if amount is a valid number
    const numAmount = parseInt(amount, 10);

    if (isNaN(numAmount) || numAmount < 1) {
      return new NextResponse("Invalid amount", { status: 400 });
    }

    const freeTrial = await checkApiLimit()
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro){
        return new NextResponse("Free Trial has expired", {status:403})
    }

    const response = await openai.images.generate({

      model: "dall-e-2",
      prompt: prompt,
      n: numAmount,
      size: resolution,
    
    });

    // Log the entire response for debugging
    console.log("OpenAI API Response:", response);

    // Extract URLs safely
    let urls = response.data?.map((item) => item.url);

    if (!urls || urls.length === 0) {

        return new NextResponse("No images generated", { status: 404 });

    }

    if(!isPro){
      await increaseApiLimit();
    }

    console.log('urls', urls)
    return NextResponse.json(urls);

  } catch (error) {

    console.error("[IMAGE_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });

}
}
