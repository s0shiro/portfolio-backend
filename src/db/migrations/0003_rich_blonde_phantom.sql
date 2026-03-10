ALTER TABLE "apikey" DROP CONSTRAINT "apikey_user_id_user_id_fk";
--> statement-breakpoint
DROP INDEX "apikey_userId_idx";--> statement-breakpoint
DROP INDEX "user_role_idx";--> statement-breakpoint
ALTER TABLE "apikey" ALTER COLUMN "enabled" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "apikey" ALTER COLUMN "rate_limit_enabled" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "apikey" ALTER COLUMN "rate_limit_time_window" SET DEFAULT 60000;--> statement-breakpoint
ALTER TABLE "apikey" ALTER COLUMN "rate_limit_max" SET DEFAULT 1000;--> statement-breakpoint
ALTER TABLE "apikey" ALTER COLUMN "request_count" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "apikey" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "banned" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "apikey" ADD COLUMN "config_id" text DEFAULT 'default' NOT NULL;--> statement-breakpoint
ALTER TABLE "apikey" ADD COLUMN "reference_id" text NOT NULL;--> statement-breakpoint
CREATE INDEX "apikey_configId_idx" ON "apikey" USING btree ("config_id");--> statement-breakpoint
CREATE INDEX "apikey_referenceId_idx" ON "apikey" USING btree ("reference_id");--> statement-breakpoint
CREATE INDEX "apikey_key_idx" ON "apikey" USING btree ("key");--> statement-breakpoint
ALTER TABLE "apikey" DROP COLUMN "user_id";