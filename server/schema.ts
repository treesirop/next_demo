import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const sum = sqliteTable('sum', {
    id: text('id').primaryKey().notNull(),
    drugName: text('drug_name').notNull(),
    createdAt: integer('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
    deletedAt: integer('deleted_at'),
});