import { postgresAdapter } from "@payloadcms/db-postgres";
import { buildConfig } from "payload";
import { config as loadEnv } from "dotenv";

import { Articles } from "./src/collections/articles";
import { Categories } from "./src/collections/categories";
import { ClaimCases } from "./src/collections/claim-cases";
import { ClaimsGuides } from "./src/collections/claims-guides";
import { FaqItems } from "./src/collections/faq-items";
import { Pages } from "./src/collections/pages";
import { Products } from "./src/collections/products";
import { Providers } from "./src/collections/providers";
import { Users } from "./src/collections/users";

loadEnv();

const databaseURL = process.env.DATABASE_URL;
const payloadSecret = process.env.PAYLOAD_SECRET;

if (!databaseURL) {
  throw new Error("DATABASE_URL is required");
}

if (!payloadSecret) {
  throw new Error("PAYLOAD_SECRET is required");
}

export default buildConfig({
  secret: payloadSecret,
  admin: {
    user: Users.slug,
  },
  collections: [
    Users,
    Categories,
    Providers,
    Products,
    Articles,
    FaqItems,
    ClaimsGuides,
    ClaimCases,
    Pages,
  ],
  db: postgresAdapter({
    pool: {
      connectionString: databaseURL,
    },
  }),
  cors: [process.env.PAYLOAD_PUBLIC_SERVER_URL ?? "http://localhost:3001"],
  typescript: {
    outputFile: "src/payload-types.ts",
  },
});
