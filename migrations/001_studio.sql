CREATE TABLE `audit` (
	`id` text PRIMARY KEY NOT NULL,
	`user` text NOT NULL,
	`action` text NOT NULL,
	`entity` text NOT NULL,
	`before` text,
	`after` text,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` text PRIMARY KEY NOT NULL,
	`customer` text NOT NULL,
	`artist` text NOT NULL,
	`date` text NOT NULL,
	`time` text NOT NULL,
	`duration` integer DEFAULT 60 NOT NULL,
	`service` text NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`data` text NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`amount` integer DEFAULT 0 NOT NULL,
	`paid` integer DEFAULT 0 NOT NULL,
	`payment` text DEFAULT 'UNPAID' NOT NULL,
	`created` text NOT NULL,
	FOREIGN KEY (`customer`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `bookings_date_artist` ON `bookings` (`date`,`artist`);--> statement-breakpoint
CREATE INDEX `bookings_customer` ON `bookings` (`customer`);--> statement-breakpoint
CREATE TABLE `content` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`data` text DEFAULT '{}' NOT NULL,
	`sort` integer DEFAULT 0 NOT NULL,
	`updated` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `content_kind_slug` ON `content` (`kind`,`slug`);--> statement-breakpoint
CREATE INDEX `content_kind_status` ON `content` (`kind`,`status`);--> statement-breakpoint
CREATE TABLE `customers` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`marketing` integer DEFAULT 0 NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `customers_email_unique` ON `customers` (`email`);--> statement-breakpoint
CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`path` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `events_type_created` ON `events` (`type`,`created`);--> statement-breakpoint
CREATE TABLE `limits` (
	`id` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`size` integer NOT NULL,
	`folder` text NOT NULL,
	`owner` text NOT NULL,
	`public` integer DEFAULT 0 NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`category` text NOT NULL,
	`message` text NOT NULL,
	`status` text DEFAULT 'unread' NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`booking` text,
	`channel` text DEFAULT 'admin' NOT NULL,
	`status` text DEFAULT 'unread' NOT NULL,
	`due` text,
	`data` text DEFAULT '{}' NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `slots` (
	`id` text PRIMARY KEY NOT NULL,
	`booking` text NOT NULL,
	`artist` text NOT NULL,
	`date` text NOT NULL,
	`time` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `slots_unique` ON `slots` (`artist`,`date`,`time`);--> statement-breakpoint
CREATE INDEX `slots_booking` ON `slots` (`booking`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`artist` text,
	`active` integer DEFAULT 1 NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);