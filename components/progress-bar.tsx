"use client";

import { useEffect } from "react";

export default function ScrollProgressBar() {
  useEffect(() => {
    // Add scroll event handler to update progress bar
    const updateProgressBar = () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrollPercentage = (scrollTop / scrollHeight) * 100;

      const progressBar = document.getElementById("progress-bar");
      if (progressBar) {
        progressBar.style.width = `${scrollPercentage}%`;
      }
    };

    window.addEventListener("scroll", updateProgressBar);

    // Initial call
    updateProgressBar();

    return () => window.removeEventListener("scroll", updateProgressBar);
  }, []);

  return (
    <div
      id="progress-bar"
      className="fixed top-0 left-0 h-1 bg-primary z-50"
    ></div>
  );
}
