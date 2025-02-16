import { client } from "@/sanity/lib/client";
import { STARTUP_BY_ID_QUERY } from "@/sanity/lib/queries";
import React from "react";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const details = client.fetch(STARTUP_BY_ID_QUERY, { id });
  return (
    <>
      <h1 className="text-3xl">Startup Page</h1>
      <p>Startup ID: {id}</p>
      <p>Details: {details.toString()}</p>
    </>
  );
};

export default Page;
