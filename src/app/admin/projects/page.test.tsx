import { render, screen, waitFor } from "@testing-library/react"
import AdminProjectsPage from "./page"
import { supabase } from "@/lib/supabase"

// Mock supabase client
jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(),
      })),
    })),
  },
}))

// Mock the child component to simplify
jest.mock("@/components/admin/admin-project-list", () => ({
  AdminProjectList: () => <div data-testid="mock-admin-project-list">Admin Project List</div>
}))

describe("AdminProjectsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders empty state when there are no projects", async () => {
    // Setup mock to return empty array
    const mockOrder = jest.fn().mockResolvedValue({ data: [], error: null })
    ;(supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: mockOrder
      })
    })

    const jsx = await AdminProjectsPage()
    render(jsx)

    expect(screen.getByText("Projects Dashboard")).toBeInTheDocument()
    expect(screen.getByText("Belum ada project yang diupload.")).toBeInTheDocument()
  })

  it("renders project list when projects exist", async () => {
    const mockOrder = jest.fn().mockResolvedValue({ 
      data: [{ id: "1", title: "Test" }], 
      error: null 
    })
    ;(supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: mockOrder
      })
    })

    const jsx = await AdminProjectsPage()
    render(jsx)

    expect(screen.getByText("Projects Dashboard")).toBeInTheDocument()
    expect(screen.getByTestId("mock-admin-project-list")).toBeInTheDocument()
  })

  it("renders error state when fetch fails", async () => {
    const mockOrder = jest.fn().mockResolvedValue({ 
      data: null, 
      error: { message: "Database offline" } 
    })
    ;(supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: mockOrder
      })
    })

    const jsx = await AdminProjectsPage()
    render(jsx)

    expect(screen.getByText(/Error loading projects: Database offline/i)).toBeInTheDocument()
  })
})
