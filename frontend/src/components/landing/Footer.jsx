import React from "react";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <Separator className="my-6" />

        <div className="flex justify-between items-center text-muted-foreground">
          <p>&copy; 2025 Healix. All rights reserved.</p>
          <p className="text-sm">
            Crafted by{" "}
            <a 
              href="https://github.com/wrestle-R/Healix" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Team SOS
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
          