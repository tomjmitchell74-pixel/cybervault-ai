import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  primaryKey,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 64 }).notNull().unique(),
    codename: varchar("codename", { length: 24 }).notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    tagline: varchar("tagline", { length: 200 }).notNull(),
    description: text("description").notNull(),
    category: varchar("category", { length: 64 }).notNull(),
    badge: varchar("badge", { length: 32 }),
    priceCents: integer("price_cents").notNull(),
    image: varchar("image", { length: 240 }).notNull(),
    hue: integer("hue").notNull().default(165),
    features: jsonb("features").$type<string[]>().notNull().default([]),
    capabilities: jsonb("capabilities")
      .$type<{
        speed: number;
        precision: number;
        stealth: number;
        autonomy: number;
        uptime: number;
        learning: number;
      }>()
      .notNull(),
    specs: jsonb("specs").$type<{ label: string; value: string }[]>().notNull().default([]),
    seedOrder: integer("seed_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("products_category_idx").on(t.category)]
);

export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  tagline: varchar("tagline", { length: 200 }).notNull(),
  description: text("description").notNull(),
  image: varchar("image", { length: 240 }).notNull(),
  hue: integer("hue").notNull().default(165),
});

export const productCollections = pgTable(
  "product_collections",
  {
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    collectionId: integer("collection_id")
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.productId, t.collectionId] })]
);

export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    author: varchar("author", { length: 120 }).notNull(),
    role: varchar("role", { length: 160 }).notNull().default("Verified Deployer"),
    avatarHue: integer("avatar_hue").notNull().default(165),
    rating: integer("rating").notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    body: text("body").notNull(),
    verified: boolean("verified").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("reviews_product_idx").on(t.productId)]
);

export const orders = pgTable(
  "orders",
  {
    id: serial("id").primaryKey(),
    orderNo: varchar("order_no", { length: 24 }).notNull(),
    email: varchar("email", { length: 200 }).notNull(),
    fullName: varchar("full_name", { length: 160 }).notNull(),
    company: varchar("company", { length: 200 }),
    paymentMethod: varchar("payment_method", { length: 64 }).notNull().default("Card"),
    stripeSessionId: varchar("stripe_session_id", { length: 128 }).unique(),
    totalMonthlyCents: integer("total_monthly_cents").notNull(),
    items: jsonb("items")
      .$type<
        {
          slug: string;
          name: string;
          qty: number;
          billing: "monthly" | "annual";
          priceCents: number;
          image: string;
        }[]
      >()
      .notNull(),
    status: varchar("status", { length: 24 }).notNull().default("confirmed"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("orders_order_no_idx").on(t.orderNo)]
);
