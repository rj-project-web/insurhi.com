import { config as loadEnv } from "dotenv";
import { getPayload } from "payload";

import payloadConfig from "../../payload.config";

loadEnv();

async function runSeed() {
  const payload = await getPayload({ config: payloadConfig });
  const adminEmail = process.env.CMS_ADMIN_EMAIL ?? "admin@insurhi.com";
  const adminPassword = process.env.CMS_ADMIN_PASSWORD ?? "ChangeMe123!";

  const existingAdmin = await payload.find({
    collection: "users",
    where: {
      email: {
        equals: adminEmail,
      },
    },
    limit: 1,
  });

  if (existingAdmin.docs.length === 0) {
    await payload.create({
      collection: "users",
      data: {
        email: adminEmail,
        password: adminPassword,
        displayName: "CMS 管理员",
      },
    });
    console.log(`Created admin user: ${adminEmail}`);
  } else {
    console.log(`Admin user already exists: ${adminEmail}`);
  }

  const existingAuto = await payload.find({
    collection: "categories",
    where: {
      slug: {
        equals: "auto",
      },
    },
    limit: 1,
  });

  const existingLife = await payload.find({
    collection: "categories",
    where: {
      slug: {
        equals: "life",
      },
    },
    limit: 1,
  });

  const autoCategory =
    existingAuto.docs[0] ??
    (await payload.create({
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
    }));

  const lifeCategory =
    existingLife.docs[0] ??
    (await payload.create({
      collection: "categories",
      data: {
        title: "Life Insurance",
        slug: "life",
        summary: "Life insurance basics, policy options, and claim preparation guidance.",
        seo: {
          metaTitle: "Life Insurance Guide | Insurhi",
          metaDescription: "Understand life insurance policy types and practical claim tips.",
        },
      },
    }));

  const existingFaq = await payload.find({
    collection: "faq-items",
    where: {
      question: {
        equals: "What affects auto insurance premium pricing?",
      },
    },
    limit: 1,
  });

  if (existingFaq.docs.length === 0) {
    await payload.create({
      collection: "faq-items",
      data: {
        question: "What affects auto insurance premium pricing?",
        answer: "Age, driving record, location, vehicle type, and selected coverage.",
        category: autoCategory.id,
      },
    });
  }

  const existingGuide = await payload.find({
    collection: "claims-guides",
    where: {
      slug: {
        equals: "auto-accident-claim-checklist",
      },
    },
    limit: 1,
  });

  if (existingGuide.docs.length === 0) {
    await payload.create({
      collection: "claims-guides",
      data: {
        title: "Auto Accident Claim Checklist",
        slug: "auto-accident-claim-checklist",
        category: autoCategory.id,
        steps: [
          { step: "Document the accident scene and gather contact details." },
          { step: "Notify your insurer and submit a claim ticket." },
          { step: "Upload required files and track claim status." },
        ],
        documentChecklist: [
          { item: "Driver license and policy number" },
          { item: "Accident photos and police report" },
          { item: "Repair estimate or medical records" },
        ],
        onlineClaimUrl: "https://www.insurhi.com/claims",
      },
    });
  }

  const existingArticle = await payload.find({
    collection: "articles",
    where: {
      slug: {
        equals: "life-insurance-basics",
      },
    },
    limit: 1,
  });

  if (existingArticle.docs.length === 0) {
    await payload.create({
      collection: "articles",
      data: {
        title: "Life Insurance Basics for New Policyholders",
        slug: "life-insurance-basics",
        category: lifeCategory.id,
        body: {
          root: {
            type: "root",
            children: [
              {
                type: "paragraph",
                version: 1,
                children: [
                  {
                    mode: "normal",
                    text: "Start by identifying your coverage horizon and financial dependents.",
                    type: "text",
                    style: "",
                    detail: 0,
                    format: 0,
                    version: 1,
                  },
                ],
                direction: "ltr",
                format: "",
                indent: 0,
              },
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            version: 1,
          },
        },
      },
    });
  }

  console.log("Seed completed.");
}

runSeed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
