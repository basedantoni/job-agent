"use client";

import { Button } from "@/components/ui/button";
import { create as createCompany } from "@/db/queries/companies";
import { create as createPost } from "@/db/queries/posts";
import { useState } from "react";

export function CreateCompanyButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [postId, setPostId] = useState(null);

  const handleCreatePost = async () => {
    setIsLoading(true);
    try {
      const post = await createPost({
        website: "acme.com",
        shortDescription: "details",
      });

      setPostId(JSON.parse(post)[0].id);
      console.log("post", JSON.parse(post));
    } catch (error) {
      console.error("Error creating company:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCompany = async () => {
    setIsLoading(true);
    try {
      const company = await createCompany({
        title: "ACME",
        postId: postId,
      });
      console.log("company", JSON.parse(company));
    } catch (error) {
      console.error("Error creating company:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => handleCreatePost()} disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Post"}
      </Button>
      <Button disabled={postId === null} onClick={() => handleCreateCompany()}>
        {isLoading ? "Creating..." : "Create Company"}
      </Button>
    </>
  );
}
