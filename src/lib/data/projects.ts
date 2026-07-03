export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  link: string;
  size?: "small" | "medium" | "wide";
}

export const mockProjects: Project[] = [
  {
    id: "REPTILE_NODE_V2",
    title: "Terrarium Climate Controller v2",
    description: "Closed-loop PID control system for maintaining micro-climates. Features dual ESP32 nodes, LoRa mesh networking, and sub-millimeter precision humidity sensing.",
    tags: ["C++", "ESP-IDF", "MQTT"],
    category: "Reptile IoT",
    link: "/projects/reptile-node-v2",
    size: "wide",
  },
  {
    id: "HEX_GAIT_01",
    title: "Hexapod Gait Engine",
    description: "Inverse kinematics solver running on an RTOS environment for a 18-DOF robotic platform.",
    tags: ["ROS2", "Python"],
    category: "Robotics",
    link: "/projects/hexapod-gait-engine",
    size: "medium",
  },
  {
    id: "PWR_RACK",
    title: "Smart Power Rack",
    description: "Per-outlet power monitoring and remote switching for a 42U homelab rack.",
    tags: ["KiCad", "FreeRTOS"],
    category: "Automation",
    link: "/projects/smart-power-rack",
    size: "medium",
  },
  {
    id: "LAB_DASH",
    title: "Homelab Dashboard UI",
    description: "A centralized, high-performance web dashboard integrating Grafana panels, Proxmox API metrics, and custom hardware sensor data via WebSockets.",
    tags: ["React", "Tailwind", "WebSocket"],
    category: "Web App",
    link: "/projects/homelab-dashboard",
    size: "wide",
  },
  {
    id: "EDGE_AI_VISION",
    title: "Tensor Vision M.2 Node",
    description: "Custom PCB design integrating a Coral Edge TPU via M.2 key E interface with an ESP32-S3. Performs on-device inference for security perimeter monitoring.",
    tags: ["KiCad", "TensorFlow Lite", "C++"],
    category: "Edge AI",
    link: "/projects/tensor-vision-node",
    size: "wide",
  },
  {
    id: "LORA_GATEWAY_SOLAR",
    title: "Autonomous LoRaWAN Gateway",
    description: "A solar-powered mesh gateway deployed in remote areas. Handles up to 500 end-nodes utilizing SX1302 and ESP32, optimized for deep-sleep power states.",
    tags: ["LoRaWAN", "Zephyr RTOS", "C"],
    category: "IoT Network",
    link: "/projects/autonomous-lorawan-gateway",
    size: "medium",
  },
  {
    id: "UAV_TELEMETRY",
    title: "RTOS Drone Telemetry Link",
    description: "Low-latency RF telemetry module for custom drone platforms. Built on Zephyr RTOS, delivering critical flight metrics and PID loop feedback at a 500Hz refresh rate.",
    tags: ["Zephyr", "RF Design", "C++"],
    category: "Robotics",
    link: "/projects/uav-telemetry-link",
    size: "medium",
  },
  {
    id: "FPGA_SDR",
    title: "FPGA Software-Defined Radio",
    description: "High-speed signal acquisition and filtering using an iCE40 FPGA. Implements custom DSP blocks in Verilog for analyzing 2.4GHz spectrum interference.",
    tags: ["Verilog", "FPGA", "DSP"],
    category: "Signal Processing",
    link: "/projects/fpga-sdr",
    size: "wide",
  },
];
