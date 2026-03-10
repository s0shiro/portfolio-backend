CREATE TABLE "bot_messages" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"type" text DEFAULT 'conversation' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bot_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bot_messages" ADD CONSTRAINT "bot_messages_session_id_bot_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."bot_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bot_messages_session_id_idx" ON "bot_messages" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "bot_messages_created_at_idx" ON "bot_messages" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "bot_sessions_created_at_idx" ON "bot_sessions" USING btree ("created_at");