import { Element } from 'react-scroll';
import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface FeatureProps {
    title: string;
    description: string;
    image: string | null;
}

const featureList: FeatureProps[] = [
    {
        title: "Open Source",
        description: "Open Source",
        image: null
    }
]
export const Features = ({
    id = "features",
    title = "Features",
    subtitle = "",
    features = featureList
}) => {
    return (
        <section id={`section_${id}`} className="container my-12 py-28 md:py-32 space-y-8">
            <Element name={id} className="element">
                <h2 className="text-3xl lg:text-4xl font-bold md:text-center mb-6">
                    <span className="inline bg-gradient-to-r from-[#D247BF]  to-[#FE9933] text-transparent bg-clip-text">
                        {title}
                    </span>
                </h2>
                {subtitle && subtitle.length > 0 ?
                    <p className="text-muted-foreground text-xl mt-4 mb-8 ">
                        {subtitle}
                    </p>
                    : null
                }

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:mx-24">
                    {features.map(({ title, description, image }: FeatureProps) => (
                        <Card key={title} className="hover:dark:text-light dark:hover:bg-orange-900 hover:bg-orange-400">
                            <CardHeader>
                                <CardTitle>{title}</CardTitle>
                                <CardDescription>{description}</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </Element>

        </section>
    )
}