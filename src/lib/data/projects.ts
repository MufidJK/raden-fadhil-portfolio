export interface ProjectMedia {
  id: string;
  type: "image" | "video";
  url: string;
  alt?: string;
  aiPrompt?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  link: string;
  size?: "small" | "medium" | "wide";
  technicalSpecs: { label: string; value: string }[];
  media: ProjectMedia[];
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
    technicalSpecs: [
      { label: "Microcontroller", value: "Dual ESP32-S3" },
      { label: "Networking", value: "LoRa 915MHz" },
      { label: "Sensor", value: "SHT40 (±1.8% RH)" },
      { label: "Actuator Control", value: "4-Channel PWM" },
      { label: "Power Draw", value: "1.2W Avg" },
      { label: "Protocol", value: "MQTT + TLS" },
      { label: "Loop Frequency", value: "10Hz PID" },
      { label: "Operating Temp", value: "0-50°C" }
    ],
    media: [
      {
        id: "REPTILE_NODE_V2_M1",
        type: "video",
        url: "/videos/terrarium-demo.mp4",
        alt: "Terrarium climate controller system demo",
      },
      {
        id: "REPTILE_NODE_V2_M2",
        type: "image",
        url: "https://picsum.photos/seed/pic1/1920/1080",
        alt: "Custom PCB with ESP32 microcontroller",
        aiPrompt: "A photorealistic, hyper-detailed close-up of a custom PCB with glowing LEDs and microcontrollers, dark cinematic lighting, cyberpunk hardware aesthetic, 8k resolution.",
      },
      {
        id: "REPTILE_NODE_V2_M3",
        type: "image",
        url: "https://picsum.photos/seed/pic2/1920/1080",
        alt: "Humidity sensor array mounted inside terrarium",
      },
      {
        id: "REPTILE_NODE_V2_M4",
        type: "image",
        url: "https://picsum.photos/seed/pic3/1920/1080",
        alt: "LoRa mesh networking topology diagram",
        aiPrompt: "A futuristic network topology diagram with glowing nodes connected by cyan laser lines on a dark background, holographic UI aesthetic.",
      },
      {
        id: "REPTILE_NODE_V2_M5",
        type: "video",
        url: "/videos/terrarium-assembly.mp4",
        alt: "Hardware assembly timelapse",
      },
    ],
  },
  {
    id: "HEX_GAIT_01",
    title: "Hexapod Gait Engine",
    description: "Inverse kinematics solver running on an RTOS environment for a 18-DOF robotic platform.",
    tags: ["ROS2", "Python"],
    category: "Robotics",
    link: "/projects/hexapod-gait-engine",
    size: "medium",
    technicalSpecs: [
      { label: "Servos", value: "18x 35kg Digital" },
      { label: "Degrees of Freedom", value: "18-DOF" },
      { label: "Battery", value: "4S 5000mAh LiPo" },
      { label: "Kinematics", value: "Inverse / Custom" },
      { label: "Payload", value: "2.5kg Max" }
    ],
    media: [
      {
        id: "HEX_GAIT_01_M1",
        type: "video",
        url: "/videos/hexapod-gait-demo.mp4",
        alt: "Hexapod walking gait demonstration",
      },
      {
        id: "HEX_GAIT_01_M2",
        type: "image",
        url: "https://picsum.photos/seed/pic4/1920/1080",
        alt: "Hexapod robot on test platform",
        aiPrompt: "A high-detail hexapod robot with chrome legs walking on a matte black surface, cinematic studio lighting, futuristic robotic engineering aesthetic.",
      },
      {
        id: "HEX_GAIT_01_M3",
        type: "image",
        url: "https://picsum.photos/seed/pic5/1920/1080",
        alt: "Inverse kinematics visualization overlay",
      },
      {
        id: "HEX_GAIT_01_M4",
        type: "image",
        url: "https://picsum.photos/seed/pic6/1920/1080",
        alt: "ROS2 control node architecture",
      },
    ],
  },
  {
    id: "PWR_RACK",
    title: "Smart Power Rack",
    description: "Per-outlet power monitoring and remote switching for a 42U homelab rack.",
    tags: ["KiCad", "FreeRTOS"],
    category: "Automation",
    link: "/projects/smart-power-rack",
    size: "medium",
    technicalSpecs: [
      { label: "Max Current", value: "32A Total" },
      { label: "Relays", value: "12x Solid State" },
      { label: "Switching Freq", value: "50/60Hz Sync" },
      { label: "Safety Protocol", value: "Hardware OCP" }
    ],
    media: [
      {
        id: "PWR_RACK_M1",
        type: "image",
        url: "https://picsum.photos/seed/pic7/1920/1080",
        alt: "42U server rack with power monitoring LEDs",
        aiPrompt: "A dramatic photo of a 42U server rack in a dark room with glowing blue and green LEDs, photorealistic datacenter aesthetic, 8k resolution.",
      },
      {
        id: "PWR_RACK_M2",
        type: "video",
        url: "/videos/power-rack-demo.mp4",
        alt: "Smart power rack live switching demo",
      },
      {
        id: "PWR_RACK_M3",
        type: "image",
        url: "https://picsum.photos/seed/pic8/1920/1080",
        alt: "KiCad PCB layout for power monitoring board",
      },
      {
        id: "PWR_RACK_M4",
        type: "image",
        url: "https://picsum.photos/seed/pic9/1920/1080",
        alt: "Current sensing IC close-up on prototype board",
      },
    ],
  },
  {
    id: "LAB_DASH",
    title: "Homelab Dashboard UI",
    description: "A centralized, high-performance web dashboard integrating Grafana panels, Proxmox API metrics, and custom hardware sensor data via WebSockets.",
    tags: ["React", "Tailwind", "WebSocket"],
    category: "Web App",
    link: "/projects/homelab-dashboard",
    size: "wide",
    technicalSpecs: [
      { label: "Ingest Rate", value: "5000 msg/sec" },
      { label: "Telemetry", value: "Proxmox + IPMI" },
      { label: "Latency", value: "<15ms Glass-to-Glass" },
      { label: "Display Node", value: "Raspberry Pi 4" }
    ],
    media: [
      {
        id: "LAB_DASH_M1",
        type: "image",
        url: "https://picsum.photos/seed/pic10/1920/1080",
        alt: "Homelab dashboard overview showing system metrics",
        aiPrompt: "A sleek dark-mode dashboard UI with real-time charts, CPU gauges, and network graphs, neon accent colors on dark background, modern SaaS aesthetic.",
      },
      {
        id: "LAB_DASH_M2",
        type: "video",
        url: "/videos/dashboard-live-demo.mp4",
        alt: "Live dashboard demo with real-time WebSocket updates",
      },
      {
        id: "LAB_DASH_M3",
        type: "image",
        url: "https://picsum.photos/seed/pic11/1920/1080",
        alt: "Grafana panel integration with custom data sources",
      },
      {
        id: "LAB_DASH_M4",
        type: "image",
        url: "https://picsum.photos/seed/pic12/1920/1080",
        alt: "Mobile responsive view of the dashboard",
      },
      {
        id: "LAB_DASH_M5",
        type: "image",
        url: "https://picsum.photos/seed/pic13/1920/1080",
        alt: "WebSocket connection status panel",
      },
    ],
  },
  {
    id: "EDGE_AI_VISION",
    title: "Tensor Vision M.2 Node",
    description: "Custom PCB design integrating a Coral Edge TPU via M.2 key E interface with an ESP32-S3. Performs on-device inference for security perimeter monitoring.",
    tags: ["KiCad", "TensorFlow Lite", "C++"],
    category: "Edge AI",
    link: "/projects/tensor-vision-node",
    size: "wide",
    technicalSpecs: [
      { label: "Accelerator", value: "Coral Edge TPU" },
      { label: "Interface", value: "M.2 Key E / PCIe" },
      { label: "Inference Speed", value: "4 TOPS (Int8)" },
      { label: "Vision Sensor", value: "OV2640" }
    ],
    media: [
      {
        id: "EDGE_AI_VISION_M1",
        type: "image",
        url: "https://picsum.photos/seed/pic14/1920/1080",
        alt: "Coral Edge TPU M.2 module on custom carrier board",
        aiPrompt: "A hyper-detailed macro shot of an M.2 AI accelerator chip on a custom green PCB, with glowing trace lines, cinematic hardware photography.",
      },
      {
        id: "EDGE_AI_VISION_M2",
        type: "video",
        url: "/videos/tensor-vision-inference.mp4",
        alt: "On-device inference demo with bounding box detection",
      },
      {
        id: "EDGE_AI_VISION_M3",
        type: "image",
        url: "https://picsum.photos/seed/pic15/1920/1080",
        alt: "Security camera feed with AI detection overlay",
      },
      {
        id: "EDGE_AI_VISION_M4",
        type: "image",
        url: "https://picsum.photos/seed/pic16/1920/1080",
        alt: "KiCad 3D render of the M.2 carrier PCB",
      },
      {
        id: "EDGE_AI_VISION_M5",
        type: "image",
        url: "https://picsum.photos/seed/pic17/1920/1080",
        alt: "ESP32-S3 dev board connected to Edge TPU",
      },
    ],
  },
  {
    id: "LORA_GATEWAY_SOLAR",
    title: "Autonomous LoRaWAN Gateway",
    description: "A solar-powered mesh gateway deployed in remote areas. Handles up to 500 end-nodes utilizing SX1302 and ESP32, optimized for deep-sleep power states.",
    tags: ["LoRaWAN", "Zephyr RTOS", "C"],
    category: "IoT Network",
    link: "/projects/autonomous-lorawan-gateway",
    size: "medium",
    technicalSpecs: [
      { label: "Antenna Gain", value: "5.8 dBi Omni" },
      { label: "Range", value: "15km (Line of Sight)" },
      { label: "Power Source", value: "20W Solar Panel" },
      { label: "Deep-Sleep Draw", value: "12μA Mode" }
    ],
    media: [
      {
        id: "LORA_GATEWAY_SOLAR_M1",
        type: "image",
        url: "https://picsum.photos/seed/pic18/1920/1080",
        alt: "Solar-powered gateway enclosure in the field",
        aiPrompt: "A ruggedized IoT gateway box mounted on a pole in a lush green field, solar panel on top, dramatic sunset lighting, photorealistic outdoor tech photography.",
      },
      {
        id: "LORA_GATEWAY_SOLAR_M2",
        type: "video",
        url: "/videos/lorawan-deployment.mp4",
        alt: "Gateway field deployment and range test",
      },
      {
        id: "LORA_GATEWAY_SOLAR_M3",
        type: "image",
        url: "https://picsum.photos/seed/pic19/1920/1080",
        alt: "SX1302 concentrator module soldered to carrier board",
      },
    ],
  },
  {
    id: "UAV_TELEMETRY",
    title: "RTOS Drone Telemetry Link",
    description: "Low-latency RF telemetry module for custom drone platforms. Built on Zephyr RTOS, delivering critical flight metrics and PID loop feedback at a 500Hz refresh rate.",
    tags: ["Zephyr", "RF Design", "C++"],
    category: "Robotics",
    link: "/projects/uav-telemetry-link",
    size: "medium",
    technicalSpecs: [
      { label: "RF Module", value: "CC1200 Transceiver" },
      { label: "Data Rate", value: "500kbps GFSK" },
      { label: "Refresh Rate", value: "500Hz Update" },
      { label: "Antenna", value: "SMA Dipole" }
    ],
    media: [
      {
        id: "UAV_TELEMETRY_M1",
        type: "video",
        url: "/videos/drone-telemetry-flight.mp4",
        alt: "Live telemetry during test flight",
      },
      {
        id: "UAV_TELEMETRY_M2",
        type: "image",
        url: "https://picsum.photos/seed/pic20/1920/1080",
        alt: "Custom drone with RF telemetry module visible",
        aiPrompt: "A professional racing drone hovering mid-air with a visible RF module, dark sky background with motion blur, high-speed photography aesthetic.",
      },
      {
        id: "UAV_TELEMETRY_M3",
        type: "image",
        url: "https://picsum.photos/seed/pic21/1920/1080",
        alt: "RF module PCB with SMA connector close-up",
      },
      {
        id: "UAV_TELEMETRY_M4",
        type: "image",
        url: "https://picsum.photos/seed/pic22/1920/1080",
        alt: "PID loop tuning interface on ground station",
      },
    ],
  },
  {
    id: "FPGA_SDR",
    title: "FPGA Software-Defined Radio",
    description: "High-speed signal acquisition and filtering using an iCE40 FPGA. Implements custom DSP blocks in Verilog for analyzing 2.4GHz spectrum interference.",
    tags: ["Verilog", "FPGA", "DSP"],
    category: "Signal Processing",
    link: "/projects/fpga-sdr",
    size: "wide",
    technicalSpecs: [
      { label: "Logic Gates", value: "iCE40HX8K" },
      { label: "ADC Sampling", value: "65 MSPS" },
      { label: "DSP Blocks", value: "Custom FIR Filter" },
      { label: "Frequency", value: "2.4GHz ISM Band" }
    ],
    media: [
      {
        id: "FPGA_SDR_M1",
        type: "image",
        url: "https://picsum.photos/seed/pic23/1920/1080",
        alt: "iCE40 FPGA development board with signal probes",
        aiPrompt: "A macro photograph of an FPGA chip on a development board with oscilloscope probes attached, deep blue PCB, dramatic lab lighting.",
      },
      {
        id: "FPGA_SDR_M2",
        type: "video",
        url: "/videos/sdr-spectrum-analysis.mp4",
        alt: "Real-time 2.4GHz spectrum waterfall analysis",
      },
      {
        id: "FPGA_SDR_M3",
        type: "image",
        url: "https://picsum.photos/seed/pic24/1920/1080",
        alt: "Verilog simulation waveform output",
      },
      {
        id: "FPGA_SDR_M4",
        type: "image",
        url: "https://picsum.photos/seed/pic25/1920/1080",
        alt: "SDR antenna array on rooftop test rig",
      },
      {
        id: "FPGA_SDR_M5",
        type: "image",
        url: "https://picsum.photos/seed/pic26/1920/1080",
        alt: "DSP filter response curves on oscilloscope",
      },
    ],
  },
];
