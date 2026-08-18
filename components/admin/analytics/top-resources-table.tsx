"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TopResourcesTableProps {
  resources: Array<{
    _id: string;
    views: number;
  }>;
}

export function TopResourcesTable({ resources }: TopResourcesTableProps) {
  const [resourceDetails, setResourceDetails] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [resourceType, setResourceType] = useState<string>("course");

  useEffect(() => {
    const fetchResourceDetails = async () => {
      setIsLoading(true);
      try {
        // Fetch details for each resource ID
        const detailsPromises = resources.map(async (resource) => {
          try {
            // Determine the API endpoint based on the resource type
            let endpoint = "";
            switch (resourceType) {
              case "course":
                endpoint = `/api/courses/${resource._id}`;
                break;
              case "blog":
                endpoint = `/api/blogs/${resource._id}`;
                break;
              case "project":
                endpoint = `/api/projects/${resource._id}`;
                break;
              case "lesson":
                endpoint = `/api/courses/lessons/${resource._id}`;
                break;
              case "tutorial":
                endpoint = `/api/tutorials/content/${resource._id}`;
                break;
              default:
                return { ...resource, title: "Unknown", details: "Unknown" };
            }

            const response = await fetch(endpoint);
            if (!response.ok) {
              throw new Error(
                `Failed to fetch resource: ${response.statusText}`
              );
            }

            const data = await response.json();
            return {
              ...resource,
              title: data.title || "Untitled",
              details: getResourceDetails(data, resourceType),
            };
          } catch (error) {
            console.error(
              `Error fetching details for resource ${resource._id}:`,
              error
            );
            return {
              ...resource,
              title: "Error loading resource",
              details: "Could not load details",
            };
          }
        });

        const details = await Promise.all(detailsPromises);
        setResourceDetails(details);
      } catch (error) {
        console.error("Error fetching resource details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (resources && resources.length > 0) {
      fetchResourceDetails();
    } else {
      setResourceDetails([]);
      setIsLoading(false);
    }
  }, [resources, resourceType]);

  // Helper function to extract relevant details based on resource type
  const getResourceDetails = (data: any, type: string) => {
    switch (type) {
      case "course":
        return `${data.lessons?.length || 0} lessons`;
      case "blog":
        return `${new Date(data.createdAt).toLocaleDateString()}`;
      case "project":
        return data.category || "No category";
      case "lesson":
        return `Course: ${data.course?.title || "Unknown"}`;
      case "tutorial":
        return `Topic: ${data.topic?.title || "Unknown"}`;
      default:
        return "";
    }
  };

  if (isLoading) {
    return <div className="py-4">Loading resource details...</div>;
  }

  if (resourceDetails.length === 0) {
    return <div className="py-4">No resources data available</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Rank</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Views</TableHead>
          <TableHead>Details</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {resourceDetails.map((resource, index) => (
          <TableRow key={resource._id}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>{resource.title}</TableCell>
            <TableCell>{resource.views}</TableCell>
            <TableCell>{resource.details}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
