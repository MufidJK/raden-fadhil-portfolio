import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { ContactForm } from "./contact-form"

// ---------------------------------------------------------------------------
// Mock fetch globally (AGENTS.md Rule 5 — Mocking)
// ---------------------------------------------------------------------------

const mockFetch = jest.fn()
global.fetch = mockFetch

describe("ContactForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    })
  })

  it("renders the form fields correctly", () => {
    render(<ContactForm />)
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Subject/i)).toBeInTheDocument()
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

  it("disables inputs during submission", async () => {
    // Make fetch hang so we can observe the "submitting" state
    mockFetch.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({
        ok: true,
        json: async () => ({ success: true }),
      }), 2000))
    )

    render(<ContactForm />)
    
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: "Test User" } })
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@example.com" } })
    fireEvent.change(screen.getByLabelText(/Subject/i), { target: { value: "Test Subject" } })
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: "This is a test message to submit." } })
    
    const submitButton = screen.getByRole("button", { name: /Send Message/i })
    fireEvent.click(submitButton)
    
    // Check if the button changes to "Sending..." and is disabled
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Sending.../i })).toBeDisabled()
    })
    
    // Check if inputs are disabled
    expect(screen.getByLabelText(/Full Name/i)).toBeDisabled()
    expect(screen.getByLabelText(/Email/i)).toBeDisabled()
    expect(screen.getByLabelText(/Message/i)).toBeDisabled()
  })

  it("calls fetch with correct payload on valid submission", async () => {
    render(<ContactForm />)

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: "Sarah Jenkins" } })
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "sarah@techcorp.io" } })
    fireEvent.change(screen.getByLabelText(/Subject/i), { target: { value: "PCB Project" } })
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: "I need a custom PCB layout for my project." } })

    fireEvent.click(screen.getByRole("button", { name: /Send Message/i }))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: expect.stringContaining('"fullName":"Sarah Jenkins"'),
      })
    })
  })
})
