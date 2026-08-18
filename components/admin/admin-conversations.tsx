"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Loader2,
  MoreVertical,
  Archive,
  Trash2,
  MessageCircle,
} from "lucide-react";

interface Message {
  _id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Conversation {
  _id: string;
  userId: string | null;
  userName: string;
  userEmail: string | null;
  messages: Message[];
  lastUpdated: Date;
  isArchived: boolean;
  createdAt: Date;
}

export default function AdminConversations() {
  const [activeConversations, setActiveConversations] = useState<
    Conversation[]
  >([]);
  const [archivedConversations, setArchivedConversations] = useState<
    Conversation[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoading(true);

        // Fetch active conversations
        const activeResponse = await fetch(
          "/api/chat/conversations?archived=false"
        );
        const activeData = await activeResponse.json();

        // Fetch archived conversations
        const archivedResponse = await fetch(
          "/api/chat/conversations?archived=true"
        );
        const archivedData = await archivedResponse.json();

        setActiveConversations(activeData.conversations || []);
        setArchivedConversations(archivedData.conversations || []);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        toast.error("Failed to load conversations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [toast]);

  const handleViewConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setIsViewDialogOpen(true);
  };

  const handleArchiveConversation = async (conversation: Conversation) => {
    try {
      const response = await fetch(
        `/api/chat/conversations/${conversation._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isArchived: !conversation.isArchived,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update conversation");
      }

      if (conversation.isArchived) {
        // Moving from archived to active
        setArchivedConversations((prev) =>
          prev.filter((c) => c._id !== conversation._id)
        );
        setActiveConversations((prev) => [
          { ...conversation, isArchived: false },
          ...prev,
        ]);
      } else {
        // Moving from active to archived
        setActiveConversations((prev) =>
          prev.filter((c) => c._id !== conversation._id)
        );
        setArchivedConversations((prev) => [
          { ...conversation, isArchived: true },
          ...prev,
        ]);
      }

      toast.success(
        conversation.isArchived
          ? "Conversation unarchived"
          : "Conversation archived"
      );
    } catch (error) {
      console.error("Error updating conversation:", error);
      toast.error("Failed to update conversation");
    }
  };

  const handleDeleteConversation = async (conversation: Conversation) => {
    if (
      !confirm(
        "Are you sure you want to delete this conversation? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `/api/chat/conversations/${conversation._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete conversation");
      }

      if (conversation.isArchived) {
        setArchivedConversations((prev) =>
          prev.filter((c) => c._id !== conversation._id)
        );
      } else {
        setActiveConversations((prev) =>
          prev.filter((c) => c._id !== conversation._id)
        );
      }

      toast.success("Conversation deleted successfully");
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toast.error("Failed to delete conversation");
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const renderConversationList = (
    conversations: Conversation[],
    isArchived: boolean
  ) => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }

    if (conversations.length === 0) {
      return (
        <div className="text-center p-8 text-muted-foreground">
          No {isArchived ? "archived" : "active"} conversations found.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {conversations.map((conversation) => (
          <Card key={conversation._id} className="overflow-hidden">
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage
                      src={`https://avatar.vercel.sh/${conversation.userName}`}
                    />
                    <AvatarFallback>
                      {conversation.userName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">
                      {conversation.userName}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {conversation.userEmail || "Anonymous User"}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleViewConversation(conversation)}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      View Conversation
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleArchiveConversation(conversation)}
                    >
                      <Archive className="mr-2 h-4 w-4" />
                      {isArchived ? "Unarchive" : "Archive"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteConversation(conversation)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {conversation.messages.length} messages
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Started: {formatDate(conversation.createdAt)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last updated: {formatDate(conversation.lastUpdated)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewConversation(conversation)}
                >
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Chat Conversations</h2>

      <Tabs defaultValue="active">
        <TabsList className="mb-4">
          <TabsTrigger value="active">
            Active Conversations
            {activeConversations.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeConversations.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="archived">
            Archived
            {archivedConversations.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {archivedConversations.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {renderConversationList(activeConversations, false)}
        </TabsContent>

        <TabsContent value="archived">
          {renderConversationList(archivedConversations, true)}
        </TabsContent>
      </Tabs>

      {/* Conversation View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Conversation with {selectedConversation?.userName}
            </DialogTitle>
            <DialogDescription>
              {selectedConversation?.userEmail || "Anonymous User"} •{" "}
              {selectedConversation &&
                formatDate(selectedConversation.createdAt)}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {selectedConversation?.messages.map((message, index) => (
              <div
                key={index}
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
                      className="text-sm prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{
                        __html: message.content
                          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold text
                          .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italic text
                          .replace(/\n\n/g, "</p><p>") // Paragraphs
                          .replace(
                            /\n\* (.*?)(?=\n\*|\n\d\.|\n\n|$)/gs,
                            "<li>$1</li>"
                          ) // Unordered lists
                          .replace(
                            /\n(\d+)\. (.*?)(?=\n\*|\n\d\.|\n\n|$)/gs,
                            "<li>$1. $2</li>"
                          ) // Ordered lists
                          .replace(/<li>/g, "</p><ul><li>")
                          .replace(/<\/li>\n<li>/g, "</li><li>")
                          .replace(/<\/li>(?!\n<li>)/g, "</li></ul><p>")
                          .replace(/^(.+?)(?=<\/p>|$)/, "<p>$1")
                          .replace(/(?<=<\/ul>)(.+?)(?=<\/p>|$)/, "<p>$1"),
                      }}
                    />
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                  )}
                  <p className="text-xs opacity-70 mt-1">
                    {formatDate(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center p-4 border-t">
            <p className="text-sm text-muted-foreground">
              {selectedConversation?.messages.length} messages
            </p>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  selectedConversation &&
                  handleArchiveConversation(selectedConversation)
                }
              >
                <Archive className="mr-2 h-4 w-4" />
                {selectedConversation?.isArchived ? "Unarchive" : "Archive"}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (selectedConversation) {
                    handleDeleteConversation(selectedConversation);
                    setIsViewDialogOpen(false);
                  }
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
