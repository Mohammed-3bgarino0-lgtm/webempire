export interface ReleaseNotesEntry {
  version: string;
  channel: "preview" | "production";
  title: string;
  body: string;
  required: boolean;
}

export const releaseNotes: ReleaseNotesEntry[] = [
  {
    version: "1.0.1",
    channel: "preview",
    title: "Web Empire V1.2 identity",
    body: "A complete visual refresh with the approved blue, white, and silver identity; new app icon and splash screen; redesigned home, tools, wallet, pricing, authentication, settings, and tool workspace; plus Expo SDK compatibility and security updates.",
    required: false,
  },
  {
    version: "1.0.0",
    channel: "production",
    title: "Web Empire mobile launch",
    body: "Initial mobile release with secure session handling, tools, wallet, and settings.",
    required: false,
  },
];

export const currentReleaseNote = releaseNotes[0];
