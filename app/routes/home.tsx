import type { Route } from "./+types/home";

import { ClientProof } from "~/components/client-proof";
import { Coverage } from "~/components/coverage";
import { CtaBanner } from "~/components/cta-banner";
import { Hero } from "~/components/hero";
import { MarqueeBand } from "~/components/marquee-band";
import { ServicesGrid } from "~/components/services-grid";
import { TrustBar } from "~/components/trust-bar";
import { WhyEldama } from "~/components/why-eldama";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Eldama — Your Outsourced IT Department" },
    {
      name: "description",
      content:
        "Eldama Technologies is a value-added technology company specialising in Cloud Services, Cybersecurity, Managed IT and Distribution of best-of-breed ICT solutions across Kenya, East and West Africa. Get a tailored quote today.",
    },
  ];
}

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <MarqueeBand />
      <ServicesGrid />
      <Coverage />
      <WhyEldama />
      <ClientProof />
      <CtaBanner />
    </>
  );
}
