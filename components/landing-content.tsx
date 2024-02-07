"use client";

import { Card, CardHeader, CardContent, CardDescription, CardFooter, CardTitle } from "./ui/card";

const testimonials = [
    {
        name:"Antonio",
        avatar : "A",
        title: "Software Engineer",
        description: "This is the best app for generative AI, I have used"
    },
    {
        name:"Samantha",
        avatar : "S",
        title: "Digital Marketer",
        description: "It has increased my efficiency by 50 percent"
    },
    {
        name:"Josh",
        avatar : "J",
        title: "Blogger",
        description: "Creating blogs and discussing it with AI makes me 10 times more creative"
    },
    {
        name:"Mark",
        avatar : "M",
        title: "Musician",
        description: "Using music generation gives me innovative ideas, when creative juices stop flowing"
    },
    
]

export default function LandingContent(){
    return (
        <div className="text-white px-10 pb-20">
            <h2 className="text-center text-4xl font-extrabold mb-10">
                Testimonial
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" >
                {testimonials.map( (test) => {
                    return (
                        <Card key={test.description} className="bg-[#192339] border-none text-white">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-x-2">
                                    <div>
                                        <p className="text-lg">{test.name}</p>
                                        <p className="text-zinc-400 text-sm">{test.title}</p>

                                    </div>
                                </CardTitle>
                                <CardContent className="pt-4 px-0">
                                    {test.description}
                                </CardContent>
                            </CardHeader>
                        </Card>
                    )
                    })}
            </div>
        </div>
    )
}