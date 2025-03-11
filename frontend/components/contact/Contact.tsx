"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Loader2, MessageCircle, Send, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import Turnstile from "react-turnstile";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess(false);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...Object.fromEntries(formData),
          turnstileToken
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors(errorData.errors || {});
        return;
      }

      setSuccess(true);
      (e.target as HTMLFormElement).reset();
      //setTurnstileToken("");
    } catch (error) {
      const err = "An error occurred. Please try again later.";
      setErrors({ general: err });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-3xl shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-t-xl">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800 dark:text-gray-100">
          <MessageCircle className="h-5 w-5 text-indigo-500" />
          Contact Us
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="mx-auto max-w-2xl px-6 py-8">
          {success && (
            <Alert variant="default" className="mb-6 bg-green-50 dark:bg-green-950/30 animate-in fade-in duration-300">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Your message has been sent successfully! We&apos;ll get back to you soon.
              </AlertDescription>
            </Alert>
          )}
          
          {errors.general && (
            <Alert variant="destructive" className="mb-6 bg-red-50 dark:bg-red-950/30 animate-in fade-in duration-300">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {errors.general}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="text-center mb-8">
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Have questions or feedback? We&apos;d love to hear from you.
            </p>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Fill out the form below and we&apos;ll get back to you as soon as possible.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  required
                  placeholder="Your name"
                  className={`transition-all duration-200 ${errors.name ? "border-red-500 ring-1 ring-red-500" : "border-gray-300 hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800"}`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  required
                  placeholder="your.email@example.com"
                  className={`transition-all duration-200 ${errors.email ? "border-red-500 ring-1 ring-red-500" : "border-gray-300 hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800"}`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Subject
              </label>
              <Input
                type="text"
                name="subject"
                id="subject"
                required
                placeholder="What is this regarding?"
                className={`transition-all duration-200 ${errors.subject ? "border-red-500 ring-1 ring-red-500" : "border-gray-300 hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800"}`}
              />
              {errors.subject && (
                <p className="mt-1 text-sm text-red-500">{errors.subject}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Message
              </label>
              <textarea
                name="message"
                id="message"
                required
                rows={5}
                placeholder="Your message here..."
                className={`w-full min-h-[120px] rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:outline-none transition-all duration-200 ${errors.message ? "border-red-500 ring-1 ring-red-500" : "border-gray-300 hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800/30 dark:text-gray-50 dark:focus:ring-indigo-800"}`}
              ></textarea>
              {errors.message && (
                <p className="mt-1 text-sm text-red-500">{errors.message}</p>
              )}
            </div>

            <div className="space-y-4 pt-2">
              <div className="w-full flex justify-center bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                <Turnstile
                  sitekey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY!}
                  onVerify={(token: string) => setTurnstileToken(token)}
                  theme="light"
                  className="w-full flex justify-center"
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                {!turnstileToken && (
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    <AlertCircle className="h-4 w-4 inline mr-1" />
                    Please complete the security check
                  </p>
                )}
                <div className="ml-auto">
                  <Button
                    variant="default"
                    type="submit"
                    disabled={loading || !turnstileToken}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-2 px-6 rounded-md transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
