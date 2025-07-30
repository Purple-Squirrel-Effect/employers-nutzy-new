// Shared navigation configuration for consistent site navigation
// Used by Header, Footer, and other navigation components

export interface NavigationLink {
  label: string;
  href: string;
  external?: boolean;
  description?: string;
}

export interface NavigationSection {
  title: string;
  links: NavigationLink[];
}

export interface SocialLink {
  name: string;
  href: string;
  icon: string;
  ariaLabel: string;
}

// Main navigation links for header
export const mainNavigationLinks: NavigationLink[] = [
  {
    label: "Home",
    href: "/",
    description: "Terug naar de homepage",
  },
  {
    label: "Platform",
    href: "/platform",
    description: "Ontdek ons Gen-Z recruitment platform",
  },
  {
    label: "Content & Campagnes",
    href: "/campain-strategy",
    description: "Strategische content en campagne services",
  },
  {
    label: "Blog",
    href: "/blog",
    description: "Kennis en inzichten over Gen-Z recruitment",
  },
  // {
  //   label: "Events",
  //   href: "/events",
  //   description: "Aankomende events en workshops"
  // },
  {
    label: "Over ons",
    href: "/about",
    description: "Meer over het Nutzy team",
  },
  {
    label: "Contact",
    href: "/contact",
    description: "Neem contact met ons op",
  },
];

// Footer navigation sections - organized by category
export const footerNavigationSections: NavigationSection[] = [
  {
    title: "Platform",
    links: [
      { label: "Home", href: "/" },
      { label: "Platform", href: "/platform" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Content Creatie & Campagnes", href: "/campain-strategy" },
      { label: "Strategische Planning", href: "/campain-strategy#strategy" },
    ],
  },
  {
    title: "Kennis & Support",
    links: [
      { label: "Kennis delen", href: "/blog" },
      { label: "Events", href: "/events" },
    ],
  },
  {
    title: "Bedrijf",
    links: [
      { label: "Over ons", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

// Social media links
export const socialLinks: SocialLink[] = [
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/nutzy",
    icon: "linkedin",
    ariaLabel: "Volg Nutzy op LinkedIn",
  },
  {
    name: "Instagram",
    href: "https://instagram.com/nutzy_nl",
    icon: "instagram",
    ariaLabel: "Volg Nutzy op Instagram",
  },
  {
    name: "TikTok",
    href: "https://tiktok.com/@nutzy_nl",
    icon: "tiktok",
    ariaLabel: "Volg Nutzy op TikTok",
  },
  {
    name: "Twitter",
    href: "https://twitter.com/nutzy_nl",
    icon: "twitter",
    ariaLabel: "Volg Nutzy op Twitter",
  },
];

// Utility function to check if a link is active
export function isActiveLink(href: string, currentPath: string): boolean {
  // Exact match for home page
  if (href === "/" && currentPath === "/") {
    return true;
  }
  // For other pages, check if current path starts with the href (excluding home)
  if (href !== "/" && currentPath.startsWith(href)) {
    return true;
  }
  return false;
}

// Utility function to get breadcrumb navigation
export function getBreadcrumbs(currentPath: string): NavigationLink[] {
  const breadcrumbs: NavigationLink[] = [{ label: "Home", href: "/" }];

  // Find matching navigation link
  const currentLink = mainNavigationLinks.find((link) =>
    isActiveLink(link.href, currentPath)
  );

  if (currentLink && currentLink.href !== "/") {
    breadcrumbs.push(currentLink);
  }

  return breadcrumbs;
}

// Company information
export const companyInfo = {
  name: "Nutzy",
  description:
    "Gen-Z Recruitment Platform voor visuele vacatures en creator partnerships",
  email: "hello@nutzy.nl",
  phone: "+31 (0)20 123 4567",
  address: "Amsterdam, Nederland",
  kvk: "12345678",
  btw: "NL123456789B01",
};
