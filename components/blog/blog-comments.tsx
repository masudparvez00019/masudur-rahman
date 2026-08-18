"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface Author {
  _id: string;
  name: string;
  image?: string;
}

interface Comment {
  _id: string;
  author: Author;
  content: string;
  date: string;
}

interface BlogCommentsProps {
  postId: string;
  initialComments: Comment[];
}

export default function BlogComments({
  postId,
  initialComments = [],
}: BlogCommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      toast.error("Please sign in to comment on this post.");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please enter a comment before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/blogs/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: comment }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit comment");
      }

      const data = await response.json();

      // Transform the API response to match the Comment interface
      const transformedComments = (data.blog.comments || []).map(
        (comment: any) => ({
          _id: comment._id.toString(),
          author: {
            _id: comment.author?._id?.toString() || "",
            name: comment.author?.name || "Anonymous",
            image: comment.author?.image || undefined,
          },
          content: comment.content || "",
          date: comment.createdAt || comment.date || new Date().toISOString(),
        })
      );

      // Update comments with the transformed data
      setComments(transformedComments);
      setComment("");

      toast.success("Your comment has been added successfully.");
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("Failed to submit comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        Comments ({comments.length})
      </h2>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Leave a Comment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCommentSubmit} className="space-y-4">
            <Textarea
              placeholder="Write your comment here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
            />
            <Button type="submit" disabled={!session || isSubmitting}>
              {isSubmitting
                ? "Submitting..."
                : session
                ? "Submit Comment"
                : "Sign in to Comment"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="p-4 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <Avatar>
                  <AvatarImage
                    src={
                      comment.author.image ||
                      "/placeholder.svg?height=40&width=40"
                    }
                    alt={comment.author.name}
                  />
                  <AvatarFallback>
                    {comment.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{comment.author.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(comment.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground">{comment.content}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">
              No comments yet. Be the first to comment!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
