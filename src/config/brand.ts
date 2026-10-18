// Single source of truth for the brand. To rename the site, change `name`.
// Everything else (page titles, navigation, footer, meta tags in index.html,
// logo alt text) derives from it.
const name = "AWEN";

export const BRAND = {
  name,
  fullName: `${name} Photonics`,
  tagline: "Compute with light",
  siteUrl: "https://www.awenphotonics.com/",
  logoAlt: `${name} logo: a sculpted gold robotic face with blue eyes`,
} as const;
