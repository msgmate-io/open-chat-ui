import { Element } from 'react-scroll';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";


interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "Is this template free?",
    answer: "Yes. It is a free ChadcnUI template.",
    value: "item-1",
  },
];

export const FAQ = ({ id = "section_faq", questions = FAQList }) => {
  return (
    <section
      id={`section_${id}`}
      className="container py-24 sm:py-32"
    >
      <Element name={id} className="element">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="inline bg-gradient-to-r from-[#D247BF]  to-[#FE9933] text-transparent bg-clip-text">
            FAQ
          </span>
        </h2>


        <Accordion
          type="single"
          collapsible
          className="w-full AccordionRoot"
        >
          {questions.map(({ question, answer, value }: FAQProps) => (
            <AccordionItem
              key={value}
              value={value}
            >
              <AccordionTrigger className="text-left font-bold text-base">
                {question}
              </AccordionTrigger>

              <AccordionContent>{answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <h3 className="text-sm mt-4">
          Still have questions?{" "}
          <a
            href="#"
            className="text-primary transition-all border-primary hover:border-b-2"
          >
            Contact us
          </a>
        </h3>
      </Element>

    </section>
  );
};
