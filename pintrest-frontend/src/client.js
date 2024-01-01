import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: `${import.meta.env.VITE_SANITY_PROJECTID}`,
  dataset: "production",
  apiVersion: "2023-12-30",
  useCdn: true,
  token: `${import.meta.env.VITE_SANITY_TOKEN}`,
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);
