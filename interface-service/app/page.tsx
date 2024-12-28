import Image from "next/image";
import React from "react";
import authImage from "../public/auth.png";
import { Button } from "@/components/ui/button";
const page = () => {
  return (
    <main className="h-screen flex">
      <div className="flex-1 grid place-items-center">
        <Image className="h-[94vh]" src={authImage} alt="auth image" />
      </div>
      <div className="w-[42%]">
        <Button>hello world</Button>
      </div>
    </main>
  );
};

export default page;
