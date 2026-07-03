import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { ContactForm } from "./contact-form"

describe("ContactForm Component", () => {
  it("renders the form fields correctly", () => {
    render(<ContactForm />)
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Send Message/i })).toBeInTheDocument()
  })

  it("shows validation errors when submitting empty form", async () => {
    render(<ContactForm />)
    
    fireEvent.click(screen.getByRole("button", { name: /Send Message/i }))
    
    await waitFor(() => {
      expect(screen.getByText("Name must be at least 2 characters")).toBeInTheDocument()
      expect(screen.getByText("Invalid email address")).toBeInTheDocument()
      expect(screen.getByText("Message must be at least 10 characters")).toBeInTheDocument()
    })
  })

  it("disables inputs during submission mock", async () => {
    render(<ContactForm />)
    
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "Test User" } })
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@example.com" } })
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: "This is a test message to submit." } })
    
    const submitButton = screen.getByRole("button", { name: /Send Message/i })
    fireEvent.click(submitButton)
    
    // Check if the button changes to "Sending..." and is disabled
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Sending.../i })).toBeDisabled()
    })
    
    // Check if inputs are disabled
    expect(screen.getByLabelText(/Name/i)).toBeDisabled()
    expect(screen.getByLabelText(/Email/i)).toBeDisabled()
    expect(screen.getByLabelText(/Message/i)).toBeDisabled()
  })
})
