"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, MoveUp, MoveDown } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import type { IService } from "@/lib/models/service";

export default function AdminServices() {
  const [services, setServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingService, setEditingService] = useState<IService | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("Briefcase");
  const [featuresList, setFeaturesList] = useState("");
  const [price, setPrice] = useState("");
  const [isPopular, setIsPopular] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/services");
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      } else {
        toast.error("Failed to fetch services");
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to fetch services");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const featuresArray = featuresList
        .split("\n")
        .filter((feature) => feature.trim() !== "");

      const serviceData = {
        title,
        description,
        icon,
        features: featuresArray,
        price,
        isPopular,
      };

      let response;

      if (editingService) {
        // Update existing service
        response = await fetch(`/api/services/${editingService._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(serviceData),
        });
      } else {
        // Create new service
        response = await fetch("/api/services", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(serviceData),
        });
      }

      if (response.ok) {
        toast.success(
          editingService
            ? "The service has been updated successfully."
            : "The service has been created successfully."
        );

        // Reset form and refresh services
        resetForm();
        fetchServices();
        setIsDialogOpen(false);
      } else {
        const data = await response.json();
        throw new Error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (service: IService) => {
    setEditingService(service);
    setTitle(service.title);
    setDescription(service.description);
    setIcon(service.icon);
    setFeaturesList(service.features.join("\n"));
    setPrice(service.price || "");
    setIsPopular(service.isPopular || false);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      try {
        const response = await fetch(`/api/services/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
            toast.success("The service has been deleted successfully.");
          fetchServices();
        } else {
          const data = await response.json();
          throw new Error(data.message || "Something went wrong");
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to delete service");
      }
    }
  };

  const handleMoveUp = async (service: IService, index: number) => {
    if (index === 0) return;

    try {
      const prevService = services[index - 1];

      // Swap orders
      const newOrder = prevService.order;
      const prevOrder = service.order;

      // Update current service
      await fetch(`/api/services/${service._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order: newOrder }),
      });

      // Update previous service
      await fetch(`/api/services/${prevService._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order: prevOrder }),
      });

      fetchServices();
    } catch (error) {
      toast.error("Failed to reorder services");
    }
  };

  const handleMoveDown = async (service: IService, index: number) => {
    if (index === services.length - 1) return;

    try {
      const nextService = services[index + 1];

      // Swap orders
      const newOrder = nextService.order;
      const nextOrder = service.order;

      // Update current service
      await fetch(`/api/services/${service._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order: newOrder }),
      });

      // Update next service
      await fetch(`/api/services/${nextService._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order: nextOrder }),
      });

      fetchServices();
    } catch (error) {
      toast.error("Failed to reorder services");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setIcon("Briefcase");
    setFeaturesList("");
    setPrice("");
    setIsPopular(false);
    setEditingService(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Services</CardTitle>
            <CardDescription>
              Manage your services and offerings
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1" onClick={resetForm}>
                <Plus className="h-4 w-4" /> Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingService ? "Edit Service" : "Add Service"}
                </DialogTitle>
                <DialogDescription>
                  {editingService
                    ? "Update the details of this service."
                    : "Add a new service to showcase your offerings."}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Service Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Web Development, UI/UX Design, etc."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the service"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Select value={icon} onValueChange={setIcon}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an icon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Briefcase">Briefcase</SelectItem>
                      <SelectItem value="Code">Code</SelectItem>
                      <SelectItem value="PenTool">Design</SelectItem>
                      <SelectItem value="Globe">Web</SelectItem>
                      <SelectItem value="Smartphone">Mobile</SelectItem>
                      <SelectItem value="BarChart">Analytics</SelectItem>
                      <SelectItem value="ShoppingCart">E-commerce</SelectItem>
                      <SelectItem value="Megaphone">Marketing</SelectItem>
                      <SelectItem value="Server">Server</SelectItem>
                      <SelectItem value="Database">Database</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="features">Features (one per line)</Label>
                  <Textarea
                    id="features"
                    value={featuresList}
                    onChange={(e) => setFeaturesList(e.target.value)}
                    placeholder="Responsive design&#10;SEO optimization&#10;Fast delivery"
                    className="min-h-[150px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (optional)</Label>
                  <Input
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g., $500, Starting at $1000, etc."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPopular"
                    checked={isPopular}
                    onCheckedChange={setIsPopular}
                  />
                  <Label htmlFor="isPopular">Mark as popular</Label>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      setIsDialogOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? "Saving..."
                      : editingService
                      ? "Update"
                      : "Save"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading services...</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead>Features</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Popular</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.length > 0 ? (
                  services.map((service, index) => (
                    <TableRow key={service._id.toString()}>
                      <TableCell className="font-medium">
                        {service.title}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {service.description}
                      </TableCell>
                      <TableCell>{service.icon}</TableCell>
                      <TableCell>{service.features.length} features</TableCell>
                      <TableCell>{service.price || "-"}</TableCell>
                      <TableCell>{service.isPopular ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(service)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(service._id.toString())}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMoveUp(service, index)}
                            disabled={index === 0}
                          >
                            <MoveUp className="h-4 w-4" />
                            <span className="sr-only">Move Up</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMoveDown(service, index)}
                            disabled={index === services.length - 1}
                          >
                            <MoveDown className="h-4 w-4" />
                            <span className="sr-only">Move Down</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No services found. Add some services to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
