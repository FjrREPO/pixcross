import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "What is Pixcross?",
    answer:
      "Pixcross is a cross-chain lending protocol that allows users to borrow stablecoins using NFTs or tokenized intellectual property as collateral.",
    value: "item-1",
  },
  {
    question: "Which networks does Pixcross support?",
    answer:
      "Pixcross currently operates on Ethereum Sepolia, Base Sepolia, Arbitrum Sepolia, and Avalanche Fuji, with secure cross-chain bridging powered by Chainlink CCIP.",
    value: "item-2",
  },
  {
    question: "How do curators work in Pixcross?",
    answer:
      "Curators manage stablecoin allocations across different lending pools. They earn management fees based on performance and can be created by anyone permissionlessly.",
    value: "item-3",
  },
  {
    question: "How does Pixcross handle liquidations?",
    answer:
      "When collateral value drops below the liquidation threshold, a 24-hour auction is triggered. Bidders can compete fairly, and the winning bid repays the outstanding debt.",
    value: "item-4",
  },
  {
    question: "Can I bridge NFTs and stablecoins across chains?",
    answer:
      "Yes. Stablecoins are bridged using Chainlink CCIP, while NFTs are transferred via Pixcross's custom ERC-721 bridge.",
    value: "item-5",
  },
];

export const FAQSection = () => {
  return (
    <section className="container md:w-[700px] py-24 sm:py-32" id="faq">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          FAQS
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold">
          Common Questions
        </h2>
      </div>

      <Accordion collapsible className="AccordionRoot" type="single">
        {FAQList.map(({ question, answer, value }) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger className="text-left">
              {question}
            </AccordionTrigger>

            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
