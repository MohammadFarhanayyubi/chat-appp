"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Zap,
  Shield,
  Users,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Real-time Messaging",
    description:
      "Send and receive messages instantly with WebSocket technology. No delays, no refreshing.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your conversations are protected with industry-standard encryption and secure authentication.",
  },
  {
    icon: Users,
    title: "See Who's Online",
    description:
      "Know when your friends are available with real-time online status indicators.",
  },
];

const benefits = [
  "No ads or tracking",
  "Fast and lightweight",
  "Works on all devices",
  "Easy to use interface",
];

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/chat");
    }
  }, [isLoading, isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <MessageCircle className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">SwiftChat</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:py-32">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
              <span className="flex h-2 w-2 rounded-full bg-online" />
              Real-time communication platform
            </div>
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Connect instantly with{" "}
              <span className="text-primary">SwiftChat</span>
            </h1>
            <p className="mb-8 text-pretty text-lg text-muted-foreground sm:text-xl">
              Experience seamless real-time messaging with friends and colleagues.
              Fast, secure, and beautifully designed for modern communication.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="h-12 px-8">
                <Link href="/register">
                  Start chatting free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-12 px-8 bg-transparent">
                <Link href="/login">Sign in to your account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border bg-card/30 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              Everything you need to stay connected
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Built with modern technology to deliver a fast and reliable messaging
              experience.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold text-foreground">
                Why choose SwiftChat?
              </h2>
              <p className="mb-8 text-muted-foreground">
                We built SwiftChat to be the fastest and most reliable way to
                communicate with the people who matter most to you.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-2xl">
                <div className="flex h-full flex-col">
                  <div className="mb-4 flex items-center gap-3 border-b border-border pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <MessageCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">SwiftChat</p>
                      <p className="text-xs text-muted-foreground">3 online</p>
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-muted px-4 py-2">
                        <p className="text-sm text-foreground">Hey! How are you?</p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="max-w-[80%] rounded-2xl rounded-br-md bg-primary px-4 py-2">
                        <p className="text-sm text-primary-foreground">
                          Great! Just trying out SwiftChat
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-muted px-4 py-2">
                        <p className="text-sm text-foreground">
                          It&apos;s so fast and smooth!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -right-4 -top-4 -z-10 h-full w-full rounded-2xl bg-primary/5" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-card/50 py-20">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">
            Ready to start chatting?
          </h2>
          <p className="mb-8 text-muted-foreground">
            Join thousands of users who are already enjoying SwiftChat.
          </p>
          <Button size="lg" asChild className="h-12 px-8">
            <Link href="/register">
              Create your free account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <MessageCircle className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">SwiftChat</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with the MERN stack. Real-time messaging made simple.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
