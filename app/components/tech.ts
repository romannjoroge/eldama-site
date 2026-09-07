import type { ServiceIconName } from "~/data/site";

const MAIL = /(email|outlook|exchange|mail|collaboration)/i;
const M365 = /(teams|sharepoint|intune|entra|365|office|hosted|communicat)/i;
const NETWORK = /(network|wifi|wi-?fi|switch|access ?point|cambium|telco|connect|router)/i;
const CLOUD = /(azure|cloud|backup|datto|cove|acronis|virtual|private)/i;
const HARDWARE = /(hardware|procure|laptop|desktop|server|device|printer)/i;
const SUPPORT = /(helpdesk|support|infrastructure|management|monitor)/i;
const SHIELD = /(firewall|fortinet|sophos|check ?point|harmony|mimecast|threat|phish|sandbox|incident|response|secu|antivirus|endpoint|password|keeper|knowb|usecure|webroot|cynet|mdr|awareness|audit|assess|spam)/i;

/** Maps a sub-technology name to a sensible brand icon. */
export function iconForTool(name: string): ServiceIconName {
  if (MAIL.test(name)) return "mail";
  if (M365.test(name)) return "m365";
  if (NETWORK.test(name)) return "network";
  if (CLOUD.test(name)) return "cloud";
  if (HARDWARE.test(name)) return "building";
  if (SUPPORT.test(name)) return "layers";
  if (SHIELD.test(name)) return "shield";
  return "check";
}

/** Compact label for sub-tech chips ("Firewalls: Fortinet & Sophos" → "Fortinet & Sophos"). */
export function shortToolName(name: string): string {
  const cleaned = name.split(":").pop()?.trim() ?? name;
  return cleaned.length > 22 ? `${cleaned.slice(0, 21).trimEnd()}…` : cleaned;
}
