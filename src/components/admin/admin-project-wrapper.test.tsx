import { render, screen, fireEvent } from "@testing-library/react"
import { AdminProjectWrapper, type AdminProjectData } from "./admin-project-wrapper"

// ── Mocks ──

const mockPush = jest.fn()
const mockRefresh = jest.fn()

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
    replace: jest.fn(),
  }),
}))

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { fill, priority, ...rest } = props
    return <img {...rest} data-fill={fill ? "true" : undefined} data-priority={priority ? "true" : undefined} />
  },
}))

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

jest.mock("@/lib/supabase", () => ({
  supabase: {
    storage: {
      from: () => ({
        upload: jest.fn().mockResolvedValue({ error: null }),
        getPublicUrl: () => ({ data: { publicUrl: "https://example.com/test.png" } }),
      }),
    },
  },
}))

jest.mock("@/components/ui/carousel", () => ({
  Carousel: ({ children }: { children: React.ReactNode }) => <div data-testid="carousel">{children}</div>,
  CarouselContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CarouselItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CarouselNext: () => <button>Next</button>,
  CarouselPrevious: () => <button>Previous</button>,
}))

jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTrigger: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}))

// ── Test Data ──

const mockProject: AdminProjectData = {
  id: "test-uuid-123",
  title: "Test Project Title",
  slug: "test-project-title",
  description: "A detailed test project description for unit testing.",
  category: "IoT",
  tech_stack: ["ESP32", "C++", "MQTT"],
  technical_specs: {
    Microcontroller: "ESP32-S3",
    Voltage: "3.3V",
  },
  project_media: [
    {
      id: "media-1",
      project_id: "test-uuid-123",
      media_url: "https://example.com/image1.png",
      media_type: "image",
      caption: "Test image caption",
      sort_order: 0,
      created_at: "2026-01-01T00:00:00Z",
    },
  ],
}

// ── Tests ──

describe("AdminProjectWrapper", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // ── Render Tests ──
  it("renders without crashing", () => {
    render(<AdminProjectWrapper project={mockProject} />)
    expect(screen.getByText("Test Project Title")).toBeInTheDocument()
  })

  it("displays project description", () => {
    render(<AdminProjectWrapper project={mockProject} />)
    expect(
      screen.getByText("A detailed test project description for unit testing.")
    ).toBeInTheDocument()
  })

  it("displays project category", () => {
    render(<AdminProjectWrapper project={mockProject} />)
    expect(screen.getByText("IoT")).toBeInTheDocument()
  })

  it("displays tech stack badges", () => {
    render(<AdminProjectWrapper project={mockProject} />)
    expect(screen.getByText("ESP32")).toBeInTheDocument()
    expect(screen.getByText("C++")).toBeInTheDocument()
    expect(screen.getByText("MQTT")).toBeInTheDocument()
  })

  it("displays technical specifications", () => {
    render(<AdminProjectWrapper project={mockProject} />)
    expect(screen.getByText("Microcontroller")).toBeInTheDocument()
    expect(screen.getByText("ESP32-S3")).toBeInTheDocument()
    expect(screen.getByText("Voltage")).toBeInTheDocument()
    expect(screen.getByText("3.3V")).toBeInTheDocument()
  })

  it("renders the floating admin toolbar", () => {
    render(<AdminProjectWrapper project={mockProject} />)
    expect(screen.getByRole("toolbar")).toBeInTheDocument()
    expect(screen.getByText("Enable Edit Mode")).toBeInTheDocument()
    expect(screen.getByText("Delete Project")).toBeInTheDocument()
  })

  // ── Edit Mode Toggle ──
  it("toggles edit mode when clicking the edit button", () => {
    render(<AdminProjectWrapper project={mockProject} />)

    // Initially in view mode — title is plain text
    expect(screen.getByText("Test Project Title")).toBeInTheDocument()

    // Click "Enable Edit Mode"
    fireEvent.click(screen.getByText("Enable Edit Mode"))

    // Now "Cancel Edit" should appear
    expect(screen.getByText("Cancel Edit")).toBeInTheDocument()

    // Save button should appear
    expect(screen.getByText("Save Changes")).toBeInTheDocument()
  })

  it("shows inline inputs in edit mode for title", () => {
    render(<AdminProjectWrapper project={mockProject} />)

    fireEvent.click(screen.getByText("Enable Edit Mode"))

    // Title should now be an input field
    const titleInput = screen.getByDisplayValue("Test Project Title")
    expect(titleInput).toBeInTheDocument()
    expect(titleInput.tagName).toBe("INPUT")
  })

  it("shows textarea for description in edit mode", () => {
    render(<AdminProjectWrapper project={mockProject} />)

    fireEvent.click(screen.getByText("Enable Edit Mode"))

    const descTextarea = screen.getByDisplayValue(
      "A detailed test project description for unit testing."
    )
    expect(descTextarea).toBeInTheDocument()
    expect(descTextarea.tagName).toBe("TEXTAREA")
  })

  it("restores original values when cancelling edit", () => {
    render(<AdminProjectWrapper project={mockProject} />)

    // Enter edit mode
    fireEvent.click(screen.getByText("Enable Edit Mode"))

    // Change title
    const titleInput = screen.getByDisplayValue("Test Project Title")
    fireEvent.change(titleInput, { target: { value: "Modified Title" } })
    expect(screen.getByDisplayValue("Modified Title")).toBeInTheDocument()

    // Cancel edit
    fireEvent.click(screen.getByText("Cancel Edit"))

    // Title should revert to original
    expect(screen.getByText("Test Project Title")).toBeInTheDocument()
  })

  // ── Delete Trigger ──
  it("opens delete dialog when delete button is clicked", () => {
    render(<AdminProjectWrapper project={mockProject} />)

    fireEvent.click(screen.getByText("Delete Project"))

    // The delete dialog's heading should appear
    expect(screen.getByRole("heading", { name: /Hapus Project/i })).toBeInTheDocument()
    // Project title appears in both the page h1 AND the dialog confirmation text
    const titleMatches = screen.getAllByText(/Test Project Title/)
    expect(titleMatches.length).toBeGreaterThanOrEqual(2)
  })

  it("renders media caption in read-only mode when caption exists", () => {
    render(<AdminProjectWrapper project={mockProject} />)
    expect(screen.getByText("Test image caption")).toBeInTheDocument()
  })

  it("allows editing specification key without error", () => {
    render(<AdminProjectWrapper project={mockProject} />)
    fireEvent.click(screen.getByText("Enable Edit Mode"))

    const specKeyInput = screen.getByDisplayValue("Microcontroller")
    fireEvent.change(specKeyInput, { target: { value: "MCU Core" } })
    expect(screen.getByDisplayValue("MCU Core")).toBeInTheDocument()
  })

  // ── Prop Handling for edge cases ──
  it("handles null description gracefully", () => {
    const projectNoDesc: AdminProjectData = {
      ...mockProject,
      description: null,
    }
    render(<AdminProjectWrapper project={projectNoDesc} />)
    expect(screen.getByText("Test Project Title")).toBeInTheDocument()
  })

  it("handles empty tech stack", () => {
    const projectNoTech: AdminProjectData = {
      ...mockProject,
      tech_stack: [],
    }
    render(<AdminProjectWrapper project={projectNoTech} />)
    expect(screen.getByText("Test Project Title")).toBeInTheDocument()
  })

  it("handles empty media array", () => {
    const projectNoMedia: AdminProjectData = {
      ...mockProject,
      project_media: [],
    }
    render(<AdminProjectWrapper project={projectNoMedia} />)
    expect(screen.getByText("Test Project Title")).toBeInTheDocument()
  })
})
