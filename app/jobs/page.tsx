import { columns, Job } from "@/app/jobs/columns";
import { DataTable } from "@/app/jobs/data-table";
import { db } from "@/db";
import { jobs } from "@/db/schema";

async function getData(): Promise<Job[]> {
  const data = await db.select().from(jobs);

  return data;
}

export default async function Jobs() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10 flex flex-col gap-4">
      <h1 className="text-3xl">Jobs 💼</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
