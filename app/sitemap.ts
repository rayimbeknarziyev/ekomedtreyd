import { MetadataRoute } from "next";

// Sizning saytning barcha muhim sahifalari
export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date();

  return [
    {
      url: "https://ekomedtreyd-mocha.vercel.app",
      lastModified: today,
    },
    {
      url: "https://ekomedtreyd-mocha.vercel.app/about",
      lastModified: today,
    },
    {
      url: "https://ekomedtreyd-mocha.vercel.app/contact",
      lastModified: today,
    }
  ];
}
