import { config as loadEnv } from "dotenv";
import { getPayload } from "payload";

import payloadConfig from "../../payload.config";

loadEnv();

async function runSeed() {
  const payload = await getPayload({ config: payloadConfig });

  const existing = await payload.find({
    collection: "categories",
    where: {
      slug: {
        equals: "auto",
      },
    },
    limit: 1,
  });

  if (existing.docs.length > 0) {
    console.log("Seed skipped: category 'auto' already exists.");
    return;
  }

  const category = await payload.create({
    collection: "categories",
    data: {
      title: "Auto Insurance",
      slug: "auto",
      summary: "Coverage guidance for car owners in English-speaking markets.",
      seo: {
        metaTitle: "Auto Insurance Guide | Insurhi",
        metaDescription: "Compare auto insurance plans, providers, and claim steps.",
      },
    },
  });

  await payload.create({
    collection: "faq-items",
    data: {
      question: "What affects auto insurance premium pricing?",
      answer: "Age, driving record, location, vehicle type, and selected coverage.",
      category: category.id,
    },
  });

  console.log("Seed completed.");
}

runSeed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
