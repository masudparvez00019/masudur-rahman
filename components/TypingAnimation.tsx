import React, { useState, useEffect } from "react";

interface TypingAnimationProps {
  texts: string[]; // Array of texts to type out
  speed?: number; // Typing speed in milliseconds (default: 100ms)
  delay?: number; // Delay between switching texts (default: 2000ms)
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({
  texts,
  speed = 100,
  delay = 2000,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [textIndex, setTextIndex] = useState(0); // Index of the current text in the array
  const [charIndex, setCharIndex] = useState(0); // Index of the current character being typed
  const [isDeleting, setIsDeleting] = useState(false); // Whether the text is being deleted

  useEffect(() => {
    const currentText = texts[textIndex];

    if (isDeleting) {
      // Handle deleting characters
      if (charIndex > 0) {
        setTimeout(() => {
          setDisplayedText((prev) => prev.slice(0, -1));
          setCharIndex((prev) => prev - 1);
        }, speed / 2); // Faster speed for deleting
      } else {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % texts.length); // Move to the next text
      }
    } else {
      // Handle typing characters
      if (charIndex < currentText.length) {
        setTimeout(() => {
          setDisplayedText((prev) => prev + currentText[charIndex]);
          setCharIndex((prev) => prev + 1);
        }, speed);
      } else {
        setTimeout(() => {
          setIsDeleting(true);
        }, delay); // Wait before deleting
      }
    }
  }, [charIndex, isDeleting, texts, textIndex, speed, delay]);

  return <span>{displayedText}</span>;
};

export default TypingAnimation;
