CREATE TABLE IF NOT EXISTS "applications" (
	"id" text PRIMARY KEY NOT NULL,
	"message" text NOT NULL,
	"job_id" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "applications" ADD CONSTRAINT "applications_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
