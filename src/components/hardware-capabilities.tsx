import * as React from "react"
import { Badge } from "@/components/ui/badge"

const TECH_STACK = [
  {
    category: "Microcontrollers & Boards",
    items: ["ESP32 DevKit V1", "Arduino Nano", "Arduino Uno R3", "Wemos D1 R1"],
  },
  {
    category: "Sensors & Hardware Interfaces",
    items: ["Humidity Sensor DHT22", "Ultrasonic Sensor HC-SR04", "Soil Moisture Sensor", "16x2 Display LCD I2C", "Infrared Sensor"],
  },
  {
    category: "Software & Frameworks",
    items: ["Arduino IDE", "Blynk"],
  }
];

export function HardwareCapabilities() {
  return (
    <section id="about" className="container mx-auto max-w-container-max px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-start">
        {/* COLUMN 1: The Creator & Stats */}
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl md:text-3xl font-bold font-sans tracking-tight text-foreground">
            Behind the Circuits
          </h2>
          <div className="text-muted-foreground font-jetbrains text-sm leading-relaxed max-w-none flex flex-col gap-4">
            <p>
              I am a Hardware Engineer & IoT Developer passionate about translating logic into physical motion. I specialize in building robust C++ firmware, designing low-latency telemetry systems, and ensuring continuous IoT operations.
            </p>
            <p>
              My expertise lies in bridging the gap between embedded hardware and real-time data monitoring, crafting systems that are both reliable and highly efficient.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            {/* Stat Card 1 */}
            <div className="flex flex-col p-6 bg-card border border-border/50 rounded-xl justify-center items-center text-center">
              <span className="text-3xl font-bold text-foreground mb-1">15+</span>
              <span className="text-sm font-medium text-muted-foreground">Projects Completed</span>
            </div>
            {/* Stat Card 2 */}
            <div className="flex flex-col p-6 bg-card border border-border/50 rounded-xl justify-center items-center text-center">
              <span className="text-3xl font-bold text-foreground mb-1">120+</span>
              <span className="text-sm font-medium text-muted-foreground">Sensors Deployed</span>
            </div>
          </div>
        </div>

        {/* COLUMN 2: Core Technology Stack */}
        <div className="flex flex-col gap-8 p-6 lg:p-8 bg-muted/30 rounded-2xl border border-border/50 h-full">
          {TECH_STACK.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold tracking-wider text-foreground uppercase">
                {section.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {section.items.map((item, itemIdx) => (
                  <Badge 
                    key={itemIdx} 
                    variant="outline" 
                    className="bg-background/50 hover:bg-muted transition-all duration-300 py-1.5 px-3 text-sm font-jetbrains"
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
