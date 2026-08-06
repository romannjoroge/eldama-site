import type { Route } from "./+types/home";

import { ClientProof } from "~/components/client-proof";
import { Coverage } from "~/components/coverage";
import { CtaBanner } from "~/components/cta-banner";
import { Hero } from "~/components/hero";
import { ServicesGrid } from "~/components/services-grid";
import { TrustBar } from "~/components/trust-bar";
import { WhyEldama } from "~/components/why-eldama";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Eldama — Your Outsourced IT Department" },
    {
      name: "description",
      content:
        "Eldama is one certified partner for Microsoft 365, IT outsourcing, endpoint security, cloud services, and email security. Get a tailored quote today.",
    },
  ];
}

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ServicesGrid />
      <Coverage />
      <WhyEldama />
      <ClientProof />
      <CtaBanner />
    </>
  );
}
