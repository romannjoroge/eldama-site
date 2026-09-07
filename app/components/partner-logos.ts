import cambium from "~/assets/partners/cambium.png";
import checkpoint from "~/assets/partners/checkpoint.svg";
import cynet from "~/assets/partners/cynet.png";
import datto from "~/assets/partners/datto.png";
import fortinet from "~/assets/partners/fortinet.svg";
import microsoft from "~/assets/partners/microsoft.png";
import mimecast from "~/assets/partners/mimecast.png";
import sophos from "~/assets/partners/sophos.png";
import telco from "~/assets/partners/telco.png";
import webroot from "~/assets/partners/webroot.svg";

export interface PartnerLogo {
  name: string;
  src: string;
}

/** Partner/certification logos shown in the "Certified partner of" marquee. */
export const partnerLogos: PartnerLogo[] = [
  { name: "Microsoft", src: microsoft },
  { name: "Fortinet", src: fortinet },
  { name: "Sophos", src: sophos },
  { name: "Check Point", src: checkpoint },
  { name: "Mimecast", src: mimecast },
  { name: "Webroot", src: webroot },
  { name: "Cynet", src: cynet },
  { name: "Datto", src: datto },
  { name: "Cambium Networks", src: cambium },
  { name: "Telco Systems", src: telco },
];
