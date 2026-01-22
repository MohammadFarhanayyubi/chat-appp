"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, MessageCircle, CheckCircle2, XCircle } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function VerifyEmailPage() {
  const params = useParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/user/${params.id}/verify/${params.token}`
        );
        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.message);
        } else {
          setStatus("error");
          setMessage(data.message);
        }
      } catch {
        setStatus("error");
        setMessage("Failed to verify email. Please try again.");
      }
    };

    verifyEmail();
  }, [params.id, params.token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <MessageCircle className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Email Verification</h1>
        </div>

        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-1 pb-4 text-center">
            {status === "loading" && (
              <>
                <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
                <CardTitle className="text-xl">Verifying your email...</CardTitle>
                <CardDescription>Please wait while we verify your email address</CardDescription>
              </>
            )}

            {status === "success" && (
              <>
                <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl text-primary">Email Verified!</CardTitle>
                <CardDescription>{message}</CardDescription>
              </>
            )}

            {status === "error" && (
              <>
                <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                  <XCircle className="h-8 w-8 text-destructive" />
                </div>
                <CardTitle className="text-xl text-destructive">Verification Failed</CardTitle>
                <CardDescription>{message}</CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent className="text-center">
            {status !== "loading" && (
              <Button asChild className="w-full">
                <Link href="/login">Continue to Sign In</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
