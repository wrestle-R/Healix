import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FaQuoteLeft } from "react-icons/fa";

const TestimonialsSection = () => {
  const testimonials = [
    {
      content:
        "Exceptional care and attention. The doctors here truly listen and provide comprehensive treatment plans.",
      author: "Jennifer Smith",
      role: "Patient",
    },
    {
      content:
        "The platform is incredibly user-friendly. Booking appointments and accessing my medical records has never been easier.",
      author: "Robert Johnson",
      role: "Patient",
    },
    {
      content:
        "Outstanding medical expertise combined with genuine compassion. Highly recommend this healthcare platform.",
      author: "Maria Garcia",
      role: "Patient",
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-muted/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-serif">
            What Our Patients Say
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <FaQuoteLeft className="h-6 w-6 text-primary/60 mb-4" />
                  <p className="text-muted-foreground mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {testimonial.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
