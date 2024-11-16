import "@/lib/env";
import { type Config } from "drizzle-kit";

export default {
  schema: "./lib/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
  tablesFilter: ["money_monkey_*"],
} satisfies Config;
