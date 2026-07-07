import { render, screen } from "@testing-library/react"
import { HardwareCapabilities } from "./hardware-capabilities"

describe("HardwareCapabilities", () => {
  it("renders the heading correctly", () => {
    render(<HardwareCapabilities />)
    expect(screen.getByRole("heading", { name: /Behind the Circuits/i })).toBeInTheDocument()
  })

  it("renders stat cards correctly", () => {
    render(<HardwareCapabilities />)
    expect(screen.getByText("15+")).toBeInTheDocument()
    expect(screen.getByText("Projects Completed")).toBeInTheDocument()
    
    expect(screen.getByText("120+")).toBeInTheDocument()
    expect(screen.getByText("Sensors Deployed")).toBeInTheDocument()
  })

  it("renders all tech stack categories and specific items", () => {
    render(<HardwareCapabilities />)
    
    // Categories
    expect(screen.getByText("Microcontrollers & Boards")).toBeInTheDocument()
    expect(screen.getByText("Sensors & Hardware Interfaces")).toBeInTheDocument()
    expect(screen.getByText("Software & Frameworks")).toBeInTheDocument()
    
    // Items
    expect(screen.getByText("ESP32 DevKit V1")).toBeInTheDocument()
    expect(screen.getByText("Ultrasonic Sensor HC-SR04")).toBeInTheDocument()
    expect(screen.getByText("Arduino IDE")).toBeInTheDocument()
  })
})
