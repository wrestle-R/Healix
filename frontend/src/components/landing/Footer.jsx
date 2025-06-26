import React from "react";
import { Separator } from "@/components/ui/separator";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-primary font-sans">
              Healix
            </h3>
            <p className="text-muted-foreground">
              Your trusted healthcare platform for comprehensive medical care.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>General Consultation</li>
              <li>Emergency Care</li>
              <li>Prescription Management</li>
              <li>Health Analytics</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>About Us</li>
              <li>Our Doctors</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center space-x-2">
                <FaPhone className="h-4 w-4" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <FaEnvelope className="h-4 w-4" />
                <span>info@healix.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <FaMapMarkerAlt className="h-4 w-4" />
                <span>123 Health St, Medical City</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex justify-between items-center text-muted-foreground">
          <p>&copy; 2025 Healix. All rights reserved.</p>
          <p className="text-sm">Crafted by Team SOS</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
