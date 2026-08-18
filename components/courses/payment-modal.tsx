"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";

interface PaymentModalProps {
  courseId: string;
  courseTitle: string;
  courseImage?: string;
  price: number;
  salePrice?: number;
  trigger: React.ReactNode;
}

export function PaymentModal({
  courseId,
  courseTitle,
  courseImage,
  price,
  salePrice,
  trigger,
}: PaymentModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setStep(1);
    setPaymentMethod("credit-card");
    setCardNumber("");
    setCardName("");
    setExpiryDate("");
    setCvv("");
  };

  const handleClose = () => {
    resetForm();
    setOpen(false);
  };

  const handleSubmitPayment = async () => {
    if (step === 1) {
      // Validate payment method selection
      if (!paymentMethod) {
        toast({
          title: "Error",
          description: "Please select a payment method",
          variant: "destructive",
        });
        return;
      }

      setStep(2);
      return;
    }

    // Validate card details
    if (paymentMethod === "credit-card") {
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        toast({
          title: "Error",
          description: "Please fill in all card details",
          variant: "destructive",
        });
        return;
      }

      // Simple validation
      if (cardNumber.replace(/\s/g, "").length !== 16) {
        toast({
          title: "Error",
          description: "Please enter a valid card number",
          variant: "destructive",
        });
        return;
      }

      if (cvv.length < 3) {
        toast({
          title: "Error",
          description: "Please enter a valid CVV",
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);

    try {
      // In a real application, you would process the payment with a payment provider
      // For this example, we'll simulate a successful payment

      // Generate a mock transaction ID
      const transactionId = `TXN-${Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase()}`;

      // Create enrollment with payment data
      const response = await fetch("/api/courses/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
          paymentData: {
            paymentMethod,
            amount: salePrice || price,
            transactionId,
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to process enrollment");

      // Show success message
      toast({
        title: "Payment Successful",
        description: "You have been enrolled in the course",
      });

      // Move to success step
      setStep(3);

      // Redirect to course after a delay
      setTimeout(() => {
        router.push(`/courses/${courseId}/learn`);
        handleClose();
        // Force a refresh to update the UI
        router.refresh();
      }, 3000);
    } catch (error) {
      console.error("Error processing payment:", error);
      toast({
        title: "Payment Failed",
        description:
          "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {step === 3 ? "Payment Successful" : "Complete Your Purchase"}
          </DialogTitle>
          <DialogDescription>
            {step === 3
              ? "You have successfully enrolled in the course."
              : `Enroll in "${courseTitle}" for $${(salePrice || price).toFixed(
                  2
                )}`}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4 py-4">
            <div>
              <h3 className="mb-2 text-sm font-medium">
                Select Payment Method
              </h3>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="credit-card" id="credit-card" />
                  <Label
                    htmlFor="credit-card"
                    className="flex flex-1 items-center"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Credit or Debit Card
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="flex-1">
                    PayPal
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="rounded-md bg-muted p-3 text-sm">
              <p className="font-medium">Order Summary</p>
              <div className="mt-2 flex justify-between">
                <span>{courseTitle}</span>
                <span>${(salePrice || price).toFixed(2)}</span>
              </div>
              <div className="mt-4 flex justify-between border-t pt-2 font-medium">
                <span>Total</span>
                <span>${(salePrice || price).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 py-4">
            {paymentMethod === "credit-card" ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-name">Cardholder Name</Label>
                  <Input
                    id="card-name"
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-md bg-muted p-4 text-center">
                <p>
                  You will be redirected to PayPal to complete your payment.
                </p>
              </div>
            )}

            <div className="rounded-md bg-muted p-3 text-sm">
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${(salePrice || price).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="mb-4 rounded-full bg-green-100 p-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="mb-2 text-lg font-medium">Payment Successful</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Thank you for your purchase. You now have access to the course.
            </p>
            <p className="text-sm text-muted-foreground">
              You will be redirected to the course shortly...
            </p>
          </div>
        )}

        <DialogFooter>
          {step === 1 && (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmitPayment}>Continue</Button>
            </>
          )}

          {step === 2 && (
            <>
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleSubmitPayment} disabled={loading}>
                {loading
                  ? "Processing..."
                  : `Pay $${(salePrice || price).toFixed(2)}`}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
