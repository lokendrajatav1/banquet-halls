"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";

interface ApprovalActionsProps {
  bookingId: string;
  currentStatus: string;
  adminRole: string;
}

export function ApprovalActions({ bookingId, currentStatus, adminRole }: ApprovalActionsProps) {
  const router = useRouter();
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApprove = async (nextStatus: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: nextStatus,
          comments,
        }),
      });

      if (!response.ok) throw new Error("Failed to update booking");

      router.refresh();
      setComments("");
    } catch (error) {
      console.error("Error updating booking:", error);
    } finally {
      setLoading(false);
    }
  };

  const getNextActionLabel = () => {
    if (adminRole === "ADMIN1" && currentStatus === "PENDING") {
      return { approve: "Approve & Move to Admin2", reject: "Request Changes" };
    }
    if (adminRole === "ADMIN2" && currentStatus === "APPROVED") {
      return { approve: "Request Payment", reject: "Reject Booking" };
    }
    if (adminRole === "ADMIN3" && currentStatus === "PAYMENT_COMPLETED") {
      return { approve: "Final Approval", reject: "Reject Booking" };
    }
    return null;
  };

  const getNextStatus = () => {
    if (adminRole === "ADMIN1" && currentStatus === "PENDING") {
      return { approve: "APPROVED", reject: "CHANGE_REQUESTED" };
    }
    if (adminRole === "ADMIN2" && currentStatus === "APPROVED") {
      return { approve: "PAYMENT_REQUESTED", reject: "REJECTED" };
    }
    if (adminRole === "ADMIN3" && currentStatus === "PAYMENT_COMPLETED") {
      return { approve: "CONFIRMED", reject: "REJECTED" };
    }
    return null;
  };

  const actions = getNextActionLabel();
  const statuses = getNextStatus();

  if (!actions || !statuses) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">No actions available for this booking at current status</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Take Action
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="comments">Comments / Notes</Label>
          <Textarea
            id="comments"
            placeholder="Add any comments or notes for the next level admin..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="mt-2"
            rows={4}
          />
        </div>

        <div className="flex gap-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="flex-1 gap-2" disabled={loading}>
                <CheckCircle className="w-4 h-4" />
                {actions.approve}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogTitle>Confirm Approval</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to approve this booking? This action will move the booking to the next approval level.
              </AlertDialogDescription>
              <div className="flex gap-3 justify-end">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleApprove(statuses.approve)}
                  disabled={loading}
                >
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Confirm
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex-1 gap-2" disabled={loading}>
                <XCircle className="w-4 h-4" />
                {actions.reject}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogTitle>Confirm Rejection</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to {actions.reject.toLowerCase()}? This action cannot be undone.
              </AlertDialogDescription>
              <div className="flex gap-3 justify-end">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleApprove(statuses.reject)}
                  disabled={loading}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Confirm
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
