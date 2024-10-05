CREATE TABLE `sum` (
	`id` text PRIMARY KEY NOT NULL,
	`drug_name` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` integer
);
