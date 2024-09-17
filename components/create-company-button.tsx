"use client";

import { Button } from "@/components/ui/button";
import { createCompany, getAllCompanies } from "@/db/queries/companies";
import { useState } from "react";

export function CreateCompanyButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const res = await getAllCompanies();
      console.log(res);
    } catch (error) {
      console.error("Error creating company:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={() => handleClick()} disabled={isLoading}>
      {isLoading ? "Creating..." : "Create"}
    </Button>
  );
}
