"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatWindow from "./chat-window";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = localStorage.getItem("hasVisitedBefore");
    if (!hasVisited) {
      // Set a timeout to show the unread indicator after 10 seconds
      const timer = setTimeout(() => {
        setHasUnreadMessages(true);
      }, 10000);

      localStorage.setItem("hasVisitedBefore", "true");

      return () => clearTimeout(timer);
    }
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (hasUnreadMessages) {
      setHasUnreadMessages(false);
    }
    setIsFirstLoad(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="mb-4"
          >
            <ChatWindow
              onClose={() => setIsOpen(false)}
              isFirstLoad={isFirstLoad}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        {hasUnreadMessages && !isOpen && (
          <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping -z-10" />
        )}
        <Button
          onClick={toggleChat}
          className="h-14 w-14 rounded-full shadow-lg relative bg-primary hover:bg-primary/90"
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <>
              <MessageCircle className="h-6 w-6" />
              {hasUnreadMessages && (
                <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500 animate-pulse" />
              )}
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
