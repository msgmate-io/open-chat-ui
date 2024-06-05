import { TriangleDownIcon, TriangleUpIcon } from "@radix-ui/react-icons";
import React from "react";
import { Element } from 'react-scroll';
import { Button } from "../ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";


interface languageModelProps {
    title: string;
    description: string;
}

const languageModelList: languageModelProps[] = [
    {
        title: "meta-llama/Meta-Llama-3-70B-Instruct",
        description: "From Meta's robust lineup, the Llama 3 series stands out by offering pre-trained, instruction-tuned text generation models in varying sizes."
    }
]

export const LanguageModelCard = ({ title, description }: languageModelProps) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className=""
        >
            <Card className="hover:backdrop-blur-sm hover:dark:text-light dark:hover:bg-orange-900/50 hover:bg-orange-400/50">
                <CardHeader>
                    <CardTitle className="font-bold">
                        {title}
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm">
                                {isOpen ? <TriangleUpIcon /> : <TriangleDownIcon />}

                            </Button>
                        </CollapsibleTrigger>
                    </CardTitle>
                    <CollapsibleContent>
                        <CardDescription>
                            {description}
                        </CardDescription>
                    </CollapsibleContent>
                </CardHeader>

            </Card>
        </Collapsible>
    )
}

export const LanguageModelsSection = ({
    id = "section_language_models",
    title = (<></>),
    subtitle = "",
    models = languageModelList
}) => {
    return (
        <section id={`section_${id}`} className="container my-6 py-12 md:py-24 space-y-6">
            <Element name={id} className="element">
                {title}
                {subtitle && subtitle.length > 0 ?
                    <p className="text-muted-foreground text-md mt-4 mb-8 ">
                        {subtitle}
                    </p>
                    : null
                }
                <div className="px-12 sm:px-24 md:px-24 lg:px-32">
                    <Carousel className="w-full">
                        <CarouselContent className="ml-2">
                            {models.map(({ title, description }: languageModelProps, i) => (
                                <CarouselItem
                                    key={`language_model_card_${i}`}
                                    className="p-1 mg:p-2 sm:basis-1/1 md:basis-1/2 xl:basis-1/3"
                                >
                                    <LanguageModelCard
                                        title={title}
                                        description={description}
                                    />
                                </CarouselItem>

                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="m-0 p-0" />
                        <CarouselNext />
                    </Carousel>
                </div>
            </Element>


        </section>
    );
}