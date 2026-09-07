/**
 * Central site content & configuration.
 *
 * Swap real brand assets here: logo, contact details, stats, and any copy
 * that will eventually come from the client. Theme colors live in
 * `app/app.css` under the `@theme` block.
 */

export type ServiceSlug =
  | "microsoft-365"
  | "it-outsourcing"
  | "endpoint-security"
  | "cloud-services"
  | "email-security"
  | "software-development";

export interface Tool {
  name: string;
  description: string;
}

export interface Service {
  slug: ServiceSlug;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  intro: string;
  icon: ServiceIconName;
  badge: string;
  badges: string[];
  tools: Tool[];
  clientProof: { client: string; line: string }[];
  crossSell: ServiceSlug[];
}

export type ServiceIconName =
  | "m365"
  | "network"
  | "shield"
  | "cloud"
  | "mail"
  | "code"
  | "quote"
  | "check"
  | "arrow"
  | "phone"
  | "envelope"
  | "menu"
  | "close"
  | "building"
  | "lock"
  | "users"
  | "layers"
  | "certificate"
  | "clock"
  | "briefcase"
  | "spark";

export const responseTimeHours = 24;

export const company = {
  name: "Eldama",
  legalName: "Eldama Technologies Ltd",
  tagline: "Your outsourced IT department",
  description:
    "Eldama Technologies is a value-added technology company specialising in Cloud Services, Cybersecurity, Managed IT and Distribution of best-of-breed ICT solutions across Kenya, East and West Africa.",
  email: "info@eldama.co.ke",
  phone: "+254 20 365 3000",
  address: "No.8 Eldama Ravine Close, Nairobi",
};

export const services: Service[] = [
  {
    slug: "microsoft-365",
    name: "Microsoft 365",
    shortName: "Microsoft 365",
    tagline: "Email, Teams, SharePoint, and device management — planned, deployed, and supported.",
    description:
      "Eldama is a Microsoft Gold Partner for Microsoft 365. We plan, deploy, migrate, and support the full Microsoft 365 stack so your team works from anywhere with secure, always-available productivity tools.",
    intro:
      "As Kenya's first Tier 1 Microsoft Cloud Solutions Provider, Eldama helps organisations transition from on-premise infrastructure to secure, scalable cloud productivity platforms. From a first-time migration off legacy mail to a fully managed Microsoft 365 estate, we handle licensing, setup, security configuration, and day-to-day support as one accountable partner.",
    icon: "m365",
    badge: "Microsoft Gold Partner",
    badges: [
      "Microsoft Gold Partner",
      "Tier 1 Microsoft Cloud Solutions Provider",
      "Microsoft Certified",
    ],
    tools: [
      {
        name: "Microsoft 365 Business",
        description:
          "Right-sized plans and licensing for email, Office apps, and cloud file storage — configured to your headcount and compliance needs.",
      },
      {
        name: "Exchange Online & Outlook",
        description:
          "Professional email with calendar, archiving, anti-spam, and mobile sync, including migrations from on-premises or legacy providers.",
      },
      {
        name: "Microsoft Teams & SharePoint",
        description:
          "Team chat, meetings, and shared document workspaces set up with the right governance so information stays organised and secure.",
      },
      {
        name: "Entra ID & Intune",
        description:
          "Identity and device management — single sign-on, multi-factor authentication, and conditional access policies that protect every login.",
      },
      {
        name: "SharePoint Intranets",
        description:
          "Centralised document storage, workflows and collaboration.",
      },
      {
        name: "Hosted Communications",
        description:
          "Email, VoIP, video conferencing and messaging.",
      },
    ],
    clientProof: [
      { client: "Mace Group", line: "Microsoft 365 rollout and managed support" },
      { client: "Nairobi Hospital", line: "Cloud & Endpoint Security built on Microsoft 365" },
    ],
    crossSell: ["endpoint-security", "email-security", "cloud-services"],
  },
  {
    slug: "it-outsourcing",
    name: "IT Outsourcing",
    shortName: "IT Outsourcing",
    tagline: "Hardware, software, and networking — run by one accountable team.",
    description:
      "Your entire IT operation, outsourced. Eldama designs, procures, installs, and maintains the hardware, software, and network infrastructure your business runs on — including telco and firewall services from Fortinet and Sophos.",
    intro:
      "One partner instead of juggling several vendors. We own your helpdesk, your network, your device lifecycle, and your vendor relationships, with clear SLAs and a team that answers when you call.",
    icon: "network",
    badge: "Fortinet & Sophos Partner",
    badges: ["Fortinet Partner", "Sophos Partner", "Telco Partner"],
    tools: [
      {
        name: "Helpdesk & support",
        description:
          "A responsive helpdesk for your staff — incident response, remote support, and on-site visits backed by clear response-time commitments.",
      },
      {
        name: "Hardware & software procurement",
        description:
          "Sourcing, configuration, and lifecycle management for laptops, servers, printers, and licensed software — right-sized to your budget.",
      },
      {
        name: "Networking & Wi-Fi",
        description:
          "LAN, WAN, and Wi-Fi design and support so offices, branches, and remote workers stay connected and performant.",
      },
      {
        name: "Firewalls: Fortinet & Sophos",
        description:
          "Next-generation firewall deployment and management with Fortinet FortiGate or Sophos Firewall, including VPN access for remote teams.",
      },
      {
        name: "Telco & connectivity",
        description:
          "We broker and manage business internet and voice lines, negotiating the right circuits and keeping connectivity resilient.",
      },
      {
        name: "Cambium Networks",
        description:
          "Carrier-grade wireless and Wi-Fi solutions for offices, campuses, and wide-area links.",
      },
      {
        name: "Infrastructure Management",
        description:
          "Day-to-day management of servers, networks, and security infrastructure — monitored, patched, and maintained by our engineers.",
      },
    ],
    clientProof: [
      { client: "Mace Group", line: "Full IT outsourcing and helpdesk" },
      { client: "Galleria Mall", line: "Network infrastructure and firewall management" },
    ],
    crossSell: ["microsoft-365", "endpoint-security", "cloud-services"],
  },
  {
    slug: "endpoint-security",
    name: "Endpoint Security",
    shortName: "Endpoint Security",
    tagline: "Every device protected — from antivirus to managed detection & response.",
    description:
      "Modern threats bypass basic antivirus. Eldama layers best-in-class endpoint protection — Webroot, Cynet, Usecure, KnowBe4, and Keeper — with the monitoring and response capability to stop attacks before they spread.",
    intro:
      "We secure every laptop, desktop, and server your team uses, and back it with managed detection and response (MDR) so a specialist is watching when an alert fires.",
    icon: "shield",
    badge: "Webroot, Cynet & Sophos Partner",
    badges: ["Webroot Partner", "Cynet Partner", "Sophos Partner"],
    tools: [
      {
        name: "Cyber Threat Assessments (CTAP)",
        description:
          "Basic and Advanced security audits identifying vulnerabilities.",
      },
      {
        name: "Webroot",
        description:
          "Lightweight, cloud-based antivirus and threat intelligence that protects endpoints without slowing machines down.",
      },
      {
        name: "Cynet MDR",
        description:
          "Managed detection and response — continuous monitoring, automated containment, and 24/7 security analysts on your environment.",
      },
      {
        name: "Usecure",
        description:
          "Security awareness training that turns staff from the weakest link into a working layer of defence.",
      },
      {
        name: "KnowBe4",
        description:
          "Phishing simulation and security awareness programs that measurably reduce the risk of social engineering.",
      },
      {
        name: "Keeper Password Manager",
        description:
          "Enterprise password management and secure vaulting so credentials are strong, unique, and never shared in plain text.",
      },
    ],
    clientProof: [
      { client: "Nairobi Hospital", line: "Endpoint protection and MDR" },
      { client: "Galleria Mall", line: "Endpoint security across sites" },
    ],
    crossSell: ["email-security", "microsoft-365", "cloud-services"],
  },
  {
    slug: "cloud-services",
    name: "Cloud Services",
    shortName: "Cloud Services",
    tagline: "Azure infrastructure and backup you can actually rely on.",
    description:
      "Move to the cloud with a certified partner. Eldama designs, migrates, and manages Azure infrastructure — and protects it with Datto and Cove backup so downtime and data loss are engineered out.",
    intro:
      "Whether you are consolidating servers, enabling hybrid work, or just need reliable backup, we right-size the cloud for your business and manage it day-to-day.",
    icon: "cloud",
    badge: "Microsoft Azure Partner",
    badges: ["Microsoft Azure Partner", "Datto Partner", "Cove Partner"],
    tools: [
      {
        name: "Microsoft Azure",
        description:
          "Virtual machines, storage, networking, and identity in Azure — architected for cost, performance, and resilience.",
      },
      {
        name: "Azure migrations",
        description:
          "Lift-and-shift or modernised migrations from on-premises servers, with testing and cutover handled by our engineers.",
      },
      {
        name: "Datto BCDR",
        description:
          "Business continuity and disaster recovery appliances that keep your systems running when the unexpected happens.",
      },
      {
        name: "Cove backup",
        description:
          "Cloud backup for servers, workstations, and Microsoft 365 — automated, monitored, and tested by our team.",
      },
      {
        name: "Acronis",
        description:
          "Cyber protection and backup for servers, workstations, and Microsoft 365 — automated and instantly recoverable.",
      },
      {
        name: "Private Cloud",
        description:
          "Fully managed hosting environments.",
      },
      {
        name: "Virtualization",
        description:
          "Hyper-V based server consolidation and optimisation.",
      },
    ],
    clientProof: [
      { client: "Nairobi Hospital", line: "Cloud & Endpoint Security" },
      { client: "Mace Group", line: "Azure infrastructure and cloud backup" },
    ],
    crossSell: ["it-outsourcing", "endpoint-security", "microsoft-365"],
  },
  {
    slug: "email-security",
    name: "Email Security",
    shortName: "Email Security",
    tagline: "Advanced threat protection for your most attacked channel.",
    description:
      "Email is where most attacks begin. Eldama deploys Check Point Harmony Email & Collaboration to block phishing, ransomware, and business email compromise before they reach your inbox.",
    intro:
      "We layer advanced email protection on top of your mail platform — filtering malicious links and attachments, stopping impersonation, and giving you visibility into every threat.",
    icon: "mail",
    badge: "Check Point Partner",
    badges: ["Check Point Partner"],
    tools: [
      {
        name: "Check Point Harmony Email & Collaboration",
        description:
          "AI-driven protection for email and collaboration apps that blocks phishing, malware, and account takeover attempts in real time.",
      },
      {
        name: "Mimecast",
        description:
          "Cloud-based email security that filters malicious attachments, links, and impersonation attempts before they reach your inbox.",
      },
      {
        name: "Anti-phishing & impersonation defence",
        description:
          "Protection against lookalike domains, CEO fraud, and social engineering aimed at your staff.",
      },
      {
        name: "Attachment & link sandboxing",
        description:
          "Suspicious attachments and URLs are detonated in a safe environment before anything reaches a user.",
      },
      {
        name: "Incident response & tuning",
        description:
          "Our team monitors the threat feed, investigates alerts, and tunes policy so protection stays effective without blocking business mail.",
      },
    ],
    clientProof: [
      { client: "Nairobi Hospital", line: "Email security and threat monitoring" },
      { client: "Mace Group", line: "Advanced email protection" },
    ],
    crossSell: ["endpoint-security", "microsoft-365", "it-outsourcing"],
  },
  {
    slug: "software-development",
    name: "Software Development & DevOps",
    shortName: "DevOps & Development",
    tagline: "Custom software, modern delivery pipelines, and cloud-native apps — engineered and operated by one accountable partner.",
    description:
      "From custom applications to CI/CD and infrastructure-as-code, Eldama designs, builds, and runs software delivery so your business ships faster with fewer surprises.",
    intro:
      "Your business runs on software — whether it is a custom tool your team depends on or the pipeline that ships your product. We scope, build, and operate cloud-native applications and DevOps practices as one accountable partner: code, containers, pipelines, and observability, backed by the same SLAs as the rest of your IT.",
    icon: "code",
    badge: "Azure DevOps Partner",
    badges: ["Azure DevOps Partner", "Cloud-Native & Containers"],
    tools: [
      {
        name: "Custom software development",
        description:
          "Web, mobile, and internal tools designed around how your business actually works — built, tested, and maintained by our engineers.",
      },
      {
        name: "Cloud-native apps on Azure",
        description:
          "Applications architected for the cloud — scalable, resilient, and cost-efficient from day one.",
      },
      {
        name: "CI/CD pipelines",
        description:
          "Automated build, test, and deployment with Azure DevOps and GitHub Actions so changes ship safely and often.",
      },
      {
        name: "Containers & Kubernetes",
        description:
          "Docker and AKS deployment patterns that make your software portable, repeatable, and easy to scale.",
      },
      {
        name: "Infrastructure as Code",
        description:
          "Terraform and Bicep templates that define your environment in code — versioned, reviewable, and reproducible.",
      },
      {
        name: "Monitoring & observability",
        description:
          "Application and infrastructure monitoring so you see issues before your customers do, with alerting that reaches the right people.",
      },
    ],
    clientProof: [],
    crossSell: ["cloud-services", "microsoft-365", "it-outsourcing"],
  },
];

export function getService(slug: string | undefined) {
  return services.find((s) => s.slug === slug);
}

export function getServiceByIndex(index: number) {
  return services[index];
}

export const partnerBadges = [
  "Microsoft Gold Partner",
  "Fortinet",
  "Sophos",
  "Cynet",
  "Webroot",
  "Datto",
  "Check Point",
  "Cambium Networks",
  "Telco Systems",
];

export interface ClientLogo {
  name: string;
  proof: string;
}

export const clients: ClientLogo[] = [
  { name: "Mace Group", proof: "IT Outsourcing · Microsoft 365" },
  { name: "Galleria Mall", proof: "Networking · Endpoint Security" },
  { name: "Nairobi Hospital", proof: "Cloud & Endpoint Security" },
];

export const stats = {
  yearsInBusiness: 15,
  certificationsHeld: 12,
  clientsServed: 200,
  uptimeSla: 99.9,
};

export const whyEldama = [
  {
    icon: "certificate" as ServiceIconName,
    title: "Certified experts, not generalists",
    body: "Gold-level partnerships across Microsoft, security, networking, and backup mean the people working on your IT hold the certifications to back it up.",
  },
  {
    icon: "layers" as ServiceIconName,
    title: "One partner, not many vendors",
    body: "One contract, one team, one escalation path. We coordinate the vendors so you never have to.",
  },
  {
    icon: "clock" as ServiceIconName,
    title: "Faster than building an in-house team",
    body: "Recruit, train, and retain an IT department, or get one that already exists. Outsourcing gets you coverage in days, not quarters.",
  },
  {
    icon: "briefcase" as ServiceIconName,
    title: "Proven with growing businesses",
    body: "From single-site companies to multi-site operations, we run IT for organisations that cannot afford downtime.",
  },
];

export const navLinks: { label: string; href: string }[] = services.map((s) => ({
  label: s.shortName,
  href: `/services/${s.slug}`,
}));

export function formatResponseTime() {
  return `${responseTimeHours} business hours`;
}
