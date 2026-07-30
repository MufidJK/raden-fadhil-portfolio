import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import AdminPortfolioUploadPage, { generateSlug } from "./page"

// Mock sonner toast
jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    warning: jest.fn(),
  },
}))

// Mock Supabase client to prevent real API calls in tests
jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: { id: "mock-uuid" }, error: null })),
        })),
      })),
    })),
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(() => Promise.resolve({ data: { path: "mock/path" }, error: null })),
        getPublicUrl: jest.fn(() => ({ data: { publicUrl: "https://mock.supabase.co/mock" } })),
      })),
    },
  },
}))

describe("AdminPortfolioUploadPage Unit & Integration Tests", () => {
  it("renders page header and main form sections without crashing", () => {
    render(<AdminPortfolioUploadPage />)
    
    expect(screen.getByText("Upload Portfolio Project")).toBeInTheDocument()
    expect(screen.getByText("1. Basic Information")).toBeInTheDocument()
    expect(screen.getByText("2. Technical Specifications")).toBeInTheDocument()
    expect(screen.getByText("3. Media Upload Info")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Publish Portfolio Project/i })).toBeInTheDocument()
  })

  it("automatically generates a lowercase hyphenated slug when title is typed", () => {
    render(<AdminPortfolioUploadPage />)
    
    const titleInput = screen.getByLabelText(/Project Title/i)
    const slugInput = screen.getByLabelText(/URL Slug/i) as HTMLInputElement

    fireEvent.change(titleInput, { target: { value: "Smart Reptile Terrarium 2.0!" } })
    
    expect(slugInput.value).toBe("smart-reptile-terrarium-20")
  })

  it("allows adding and deleting technical specification dynamic rows", () => {
    render(<AdminPortfolioUploadPage />)
    
    const addSpecButton = screen.getByRole("button", { name: /Add Specification/i })
    
    // Initially has 2 spec rows (#1 and #2)
    expect(screen.getByDisplayValue("Microcontroller")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Operating Voltage")).toBeInTheDocument()

    // Add a third row
    fireEvent.click(addSpecButton)
    
    // Check that 3 specification removal buttons exist
    const removeButtons = screen.getAllByRole("button", { name: /Remove specification row/i })
    expect(removeButtons.length).toBe(3)

    // Remove the first specification row
    fireEvent.click(removeButtons[0])
    expect(screen.getAllByRole("button", { name: /Remove specification row/i }).length).toBe(2)
  })

  it("displays explicit media upload constraints and warning texts", () => {
    render(<AdminPortfolioUploadPage />)
    
    expect(screen.getByText(/Maximum 5 media files/i)).toBeInTheDocument()
    expect(screen.getByText(/Video duration max 30 seconds/i)).toBeInTheDocument()
  })

  it("shows validation error messages when submitting empty form", async () => {
    render(<AdminPortfolioUploadPage />)
    
    const submitButton = screen.getByRole("button", { name: /Publish Portfolio Project/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText("Category is required")).toBeInTheDocument()
      expect(screen.getByText("Title must be at least 2 characters")).toBeInTheDocument()
      expect(screen.getByText("Description must be at least 10 characters")).toBeInTheDocument()
    })
  })

  describe("Helper Functions", () => {
    it("generateSlug correctly formats strings", () => {
      expect(generateSlug("  IoT Hydroponic System @ 2026  ")).toBe("iot-hydroponic-system-2026")
      expect(generateSlug("Firmware---v1.0")).toBe("firmware-v10")
    })
  })
})
