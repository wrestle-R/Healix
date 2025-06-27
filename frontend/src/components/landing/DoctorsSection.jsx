import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { FaStar } from "react-icons/fa";

const DoctorsSection = () => {
  const doctors = [
    {
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      experience: "15+ years",
      rating: "4.9",
      reviews: "324",
    },
    {
      name: "Dr. Michael Chen",
      specialty: "Neurologist",
      experience: "12+ years",
      rating: "4.8",
      reviews: "289",
    },
    {
      name: "Dr. Emily Rodriguez",
      specialty: "Pediatrician",
      experience: "10+ years",
      rating: "5.0",
      reviews: "412",
    },
    {
      name: "Dr. James Wilson",
      specialty: "Orthopedic Surgeon",
      experience: "18+ years",
      rating: "4.9",
      reviews: "567",
    },
    {
      name: "Dr. Lisa Thompson",
      specialty: "Dermatologist",
      experience: "11+ years",
      rating: "4.8",
      reviews: "398",
    },
  ];

  return (
    <section id="doctors" className="py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.18, ease: "linear" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-serif">
            Meet Our Doctors
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Expert healthcare professionals dedicated to your wellbeing
          </p>
        </motion.div>

        <div>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent
              className="-ml-2 md:-ml-4"
              style={{
                scrollSnapType: "x mandatory",
                scrollBehavior: "smooth",
              }}
            >
              {doctors.map((doctor, index) => (
                <CarouselItem
                  key={index}
                  className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <Card className="text-center bg-white border border-border/20 hover:border-primary hover:shadow-xl transition-all duration-150 py-6">
                    <CardHeader>
                      <div className="mx-auto mb-4">
                        <Avatar className="h-24 w-24">
                          <AvatarImage
                            src={`/api/placeholder/150/150`}
                            alt={doctor.name}
                          />
                          <AvatarFallback className="text-xl font-semibold">
                            {doctor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <CardTitle className="text-xl">{doctor.name}</CardTitle>
                      <CardDescription className="text-primary font-medium">
                        {doctor.specialty}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Experience: {doctor.experience}
                        </p>
                        <div className="flex items-center justify-center space-x-2">
                          <div className="flex items-center space-x-1">
                            <FaStar className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium">{doctor.rating}</span>
                          </div>
                          <span className="text-muted-foreground">
                            ({doctor.reviews} reviews)
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default DoctorsSection;
