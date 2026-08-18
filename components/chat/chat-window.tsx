"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatWindowProps {
  onClose: () => void;
  isFirstLoad?: boolean;
}

export default function ChatWindow({
  onClose,
  isFirstLoad = false,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [currentTypingIndex, setCurrentTypingIndex] = useState(-1);
  const [displayedContent, setDisplayedContent] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingSpeed = 2000; // Characters per frame (adjust for faster/slower typing)
  const { data: session } = useSession();

  // Fetch initial conversation or create a new one
  useEffect(() => {
    const fetchInitialConversation = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/chat");
        const data = await response.json();

        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages);
          setConversationId(data._id);
        }
      } catch (error) {
        console.error("Error fetching initial conversation:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialConversation();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle typing animation effect
  useEffect(() => {
    const lastMessageIndex = messages.length - 1;
    const lastMessage = messages[lastMessageIndex];

    if (
      lastMessage &&
      lastMessage.role === "assistant" &&
      !isTypingComplete &&
      !isLoading
    ) {
      setCurrentTypingIndex(lastMessageIndex);
      setDisplayedContent("");
      setIsTypingComplete(false);

      let currentIndex = 0;
      const fullContent = lastMessage.content;

      const typingInterval = setInterval(() => {
        if (currentIndex < fullContent.length) {
          setDisplayedContent(
            (prevContent) => prevContent + fullContent.charAt(currentIndex)
          );
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTypingComplete(true);
        }
      }, 1000 / typingSpeed);

      return () => clearInterval(typingInterval);
    }
  }, [messages, isLoading]);

  // Reset typing state when new message is received
  useEffect(() => {
    if (isLoading) {
      setIsTypingComplete(false);
    }
  }, [isLoading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: "user" as const,
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setIsTypingComplete(false);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          conversationId,
        }),
      });

      const data = await response.json();

      if (data.message) {
        const assistantMessage = {
          ...data.message,
          isTyping: true,
        };
        setMessages((prev) => [...prev, assistantMessage]);
        if (data.conversationId) {
          setConversationId(data.conversationId);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting. Please try again later.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to format and render message content
  const formatMessageContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold text
      .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italic text
      .replace(/\n\n/g, "</p><p>") // Paragraphs
      .replace(/\n\* (.*?)(?=\n\*|\n\d\.|\n\n|$)/gs, "<li>$1</li>") // Unordered lists
      .replace(/\n(\d+)\. (.*?)(?=\n\*|\n\d\.|\n\n|$)/gs, "<li>$1. $2</li>") // Ordered lists
      .replace(/<li>/g, "</p><ul><li>")
      .replace(/<\/li>\n<li>/g, "</li><li>")
      .replace(/<\/li>(?!\n<li>)/g, "</li></ul><p>")
      .replace(/^(.+?)(?=<\/p>|$)/, "<p>$1")
      .replace(/(?<=<\/ul>)(.+?)(?=<\/p>|$)/, "<p>$1");
  };

  return (
    <Card className="w-[350px] md:w-[450px] h-[500px] shadow-xl border-primary/10 overflow-hidden">
      <CardHeader className="bg-primary/5 p-4 border-b">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src="" alt="AI Assistant" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">Portfolio Assistant</h3>
            <p className="text-xs text-muted-foreground">
              Powered by Gemini AI
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 h-[360px] overflow-y-auto">
        <div className="flex flex-col p-4 space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {message.role === "assistant" ? (
                  <div
                    className="text-sm prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html:
                        index === currentTypingIndex && !isTypingComplete
                          ? formatMessageContent(displayedContent) +
                            (isTypingComplete
                              ? ""
                              : "<span class='typing-cursor'>|</span>")
                          : formatMessageContent(message.content),
                    }}
                  />
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
                <p className="text-xs opacity-70 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p className="text-sm">Thinking...</p>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      <CardFooter className="p-3 border-t">
        <form onSubmit={handleSendMessage} className="flex w-full space-x-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
