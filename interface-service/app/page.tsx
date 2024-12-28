"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaFileInvoice } from "react-icons/fa";
import { FaGithubAlt } from "react-icons/fa";

const SignUpPage = () => {
  const handleEmailSignIn = (e: React.FormEvent) => {};

  return (
    <div className="min-h-screen grid grid-cols-2">
      {/* Left Section */}
      <div className="bg-black p-8 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-white p-1 rounded-sm">
              <FaFileInvoice className="text-blue-600 text-2xl" />
            </span>
            <span className="text-white text-xl font-semibold">
              University Tracking
            </span>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="p-8 flex items-center justify-center">
        <Card className="w-full max-w-md border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              University Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-500 text-sm">
              Web site to make your university file validation more easier.
            </p>

            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <Input
                type="email"
                placeholder="name@example.com"
                className="w-full"
              />
              <Input
                type="password"
                placeholder="Eg : RXWZLZPqcYhrd1a"
                className="w-full"
              />
              <Button type="submit" className="w-full" variant="default">
                Sign In
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              <FaGithubAlt className="h-4 w-4" /> GitHub
            </Button>

            <p className="text-center text-sm text-gray-500">
              By clicking continue, you agree to our
              <a href="#" className="underline hover:text-gray-800">
                Terms of Service
              </a>
              and
              <a href="#" className="underline hover:text-gray-800">
                Privacy Policy
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUpPage;
