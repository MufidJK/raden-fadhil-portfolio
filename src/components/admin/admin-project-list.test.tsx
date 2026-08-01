import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { AdminProjectList } from "./admin-project-list"
import { deleteProjectAction } from "@/app/admin/projects/actions"
import { toast } from "sonner"
import type { SupabaseProject } from "@/lib/data/projects"

// Mock dependencies
jest.mock("@/app/admin/projects/actions", () => ({
  deleteProjectAction: jest.fn(),
}))

jest.mock("sonner", () => ({
  toast: {
    loading: jest.fn(() => "test-toast-id"),
    success: jest.fn(),
    error: jest.fn(),
  },
}))

// Mock Next.js Link
jest.mock("next/link", () => {
  const React = require("react")
  return ({ children, href, className }: any) => {
    return React.createElement("a", { href, className }, children)
  }
})

const mockProjects: SupabaseProject[] = [
  {
    id: "1",
    title: "Project One",
    slug: "project-one",
    description: "First project",
    technical_specs: {},
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    category: "Web",
    tech_stack: ["React"],
  },
  {
    id: "2",
    title: "Project Two",
    slug: "project-two",
    description: "Second project",
    technical_specs: {},
    created_at: "2023-01-02T00:00:00Z",
    updated_at: "2023-01-02T00:00:00Z",
    category: "IoT",
    tech_stack: ["C++"],
  },
]

describe("AdminProjectList", () => {
  beforeAll(() => {
    // Mock ResizeObserver for Radix UI
    global.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the list of projects", () => {
    render(<AdminProjectList projects={mockProjects} />)
    expect(screen.getByText("Project One")).toBeInTheDocument()
    expect(screen.getByText("Project Two")).toBeInTheDocument()
    expect(screen.getByText("Web")).toBeInTheDocument()
    expect(screen.getByText("IoT")).toBeInTheDocument()
  })

  it("opens the delete confirmation dialog when delete button is clicked", () => {
    render(<AdminProjectList projects={mockProjects} />)
    
    // There are 2 delete buttons
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i })
    expect(deleteButtons).toHaveLength(2)

    fireEvent.click(deleteButtons[0]) // Click delete for Project One

    // The dialog should appear
    expect(screen.getByText("Are you absolutely sure?")).toBeInTheDocument()
  })

  it("calls deleteProjectAction when confirmation is accepted", async () => {
    (deleteProjectAction as jest.Mock).mockResolvedValue({ success: true })

    render(<AdminProjectList projects={mockProjects} />)
    
    // Click delete for Project One
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i })
    fireEvent.click(deleteButtons[0])

    // Wait for dialog to open
    const confirmButton = await screen.findByRole("button", { name: /delete project/i })
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(deleteProjectAction).toHaveBeenCalledWith("1")
      expect(toast.success).toHaveBeenCalledWith("Project deleted successfully", expect.any(Object))
    })
  })

  it("shows an error toast if deletion fails", async () => {
    (deleteProjectAction as jest.Mock).mockResolvedValue({ error: "Server error" })

    render(<AdminProjectList projects={mockProjects} />)
    
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i })
    fireEvent.click(deleteButtons[0])

    const confirmButton = await screen.findByRole("button", { name: /delete project/i })
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(deleteProjectAction).toHaveBeenCalledWith("1")
      expect(toast.error).toHaveBeenCalledWith("Failed to delete: Server error", expect.any(Object))
    })
  })
})
