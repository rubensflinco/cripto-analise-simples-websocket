export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Criptomoedas Lista",
  description: "Lista simples e bela de criptomoedas.",
  navItems: [
    {
      label: "Inicio",
      href: "/",
    },
    {
      label: "Criptomoedas",
      href: "/coins",
    }
  ],
  links: {
    github: "https://github.com/rubensflinco",
  },
};
