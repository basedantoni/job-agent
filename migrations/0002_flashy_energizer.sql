ALTER TABLE "applications" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "updated_at" timestamp DEFAULT now();