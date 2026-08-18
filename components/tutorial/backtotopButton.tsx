'use client'

import React from "react";
import { Button } from "../ui/button";
import { ArrowUp } from "lucide-react";

export default function BackToTopButton() {
  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        className="ml-auto"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUp className="h-4 w-4 mr-1.5" />
        Back to top
      </Button>
    </>
  );
}
