import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Glasses, Smartphone } from "lucide-react";

const TherapySection = () => {
    const navigate = useNavigate();
  return (
    <div>
      {/* VR/AR Therapy Section */}
      <section id="therapy" className="py-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Next-Gen <span className="text-primary">VR/AR Therapy</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the future of physical rehabilitation with our immersive VR and AR therapy sessions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* VR Therapy Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-background/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-border hover:shadow-2xl transition-all duration-300"
            >
<div className="mb-6">
  <Glasses className="w-16 h-16 text-primary" />
</div>
              <h3 className="text-2xl font-bold text-foreground mb-4">VR Therapy Studio</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Immerse yourself in our virtual therapy room with professional instructor models, 
                realistic environments, and guided rehabilitation exercises.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-foreground">3D Virtual Environment</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-foreground">AI Exercise Tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-foreground">Progress Analytics</span>
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => navigate("/therapy-routines")}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
                >
                  Start VR Therapy
                </Button>
              </motion.div>
            </motion.div>

            {/* AR Therapy Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-background/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-border hover:shadow-2xl transition-all duration-300"
            >
              <div className="mb-6">
  <Smartphone className="w-16 h-16 text-secondary" />
</div>
              <h3 className="text-2xl font-bold text-foreground mb-4">AR Therapy Mobile</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Transform your space into a therapy studio with augmented reality. 
                Follow 3D exercise models overlaid in your real environment.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span className="text-foreground">Real-time AR Overlay</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span className="text-foreground">Mobile Camera Integration</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span className="text-foreground">Exercise Form Analysis</span>
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => navigate("/therapy-routines")}
                  variant="outline"
                  className="w-full border-secondary text-black hover:bg-secondary hover:text-secondary-foreground font-semibold py-3 "
                >
                  Try AR Therapy
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground text-sm">Therapy Routines</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground text-sm">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">10k+</div>
              <div className="text-muted-foreground text-sm">Sessions Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground text-sm">Available</div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default TherapySection
