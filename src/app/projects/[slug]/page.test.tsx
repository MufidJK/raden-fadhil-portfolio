import { render, screen } from "@testing-library/react"
import ProjectDetailPage from "./page"
import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase"
import React from "react"

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND")
  }),
}))

jest.mock("next/image", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function MockImage(props: Record<string, any>) {
    const { fill, priority, ...rest } = props
    // eslint-disable-next-line @next/next/no-img-element
    return <img data-fill={fill ? "true" : undefined} data-priority={priority ? "true" : undefined} alt="" {...rest} />
  }
  MockImage.displayName = "MockImage"
  return { __esModule: true, default: MockImage }
})

jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn(),
  },
}))

describe("ProjectDetailPage", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("(a) renders project details from Supabase when database hit occurs", async () => {
    const mockDbProject = {
      id: "DB_PROJ_1",
      title: "Real Database Project Title",
      slug: "real-db-project",
      description: "Project fetched directly from Supabase database.",
      category: "Hardware",
      tech_stack: ["C++", "FreeRTOS"],
      technical_specs: { "MCU": "STM32F4" },
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
      project_media: [
        {
          id: "M1",
          project_id: "DB_PROJ_1",
          media_url: "https://picsum.photos/seed/db1/1920/1080",
          media_type: "image",
          caption: "Database Image",
          sort_order: 0,
          created_at: null,
        },
      ],
    }

    const mockSingle = jest.fn().mockResolvedValue({ data: mockDbProject, error: null })
    const mockOrder = jest.fn().mockReturnValue({ single: mockSingle })
    const mockEq = jest.fn().mockReturnValue({ order: mockOrder })
    const mockSelect = jest.fn().mockReturnValue({ eq: mockEq })

    ;(supabase.from as jest.Mock).mockReturnValue({ select: mockSelect })

    const jsx = await ProjectDetailPage({ params: Promise.resolve({ slug: "real-db-project" }) })
    render(jsx)

    expect(screen.getByText("Real Database Project Title")).toBeInTheDocument()
    expect(screen.getByText("Project fetched directly from Supabase database.")).toBeInTheDocument()
    expect(screen.getByText("STM32F4")).toBeInTheDocument()
  })

  it("(b) renders fallback project data when Supabase returns no data but slug matches fallbackProjects", async () => {
    const mockSingle = jest.fn().mockResolvedValue({ data: null, error: { message: "No rows found" } })
    const mockOrder = jest.fn().mockReturnValue({ single: mockSingle })
    const mockEq = jest.fn().mockReturnValue({ order: mockOrder })
    const mockSelect = jest.fn().mockReturnValue({ eq: mockEq })

    ;(supabase.from as jest.Mock).mockReturnValue({ select: mockSelect })

    const jsx = await ProjectDetailPage({ params: Promise.resolve({ slug: "homelab-dashboard" }) })
    render(jsx)

    expect(screen.getByText("Homelab Dashboard UI")).toBeInTheDocument()
    expect(screen.getByText(/A centralized, high-performance web dashboard/)).toBeInTheDocument()
    expect(screen.getByText("5000 msg/sec")).toBeInTheDocument()
  })

  it("(c) calls notFound when Supabase returns no data and no match is found in fallbackProjects", async () => {
    const mockSingle = jest.fn().mockResolvedValue({ data: null, error: { message: "No rows found" } })
    const mockOrder = jest.fn().mockReturnValue({ single: mockSingle })
    const mockEq = jest.fn().mockReturnValue({ order: mockOrder })
    const mockSelect = jest.fn().mockReturnValue({ eq: mockEq })

    ;(supabase.from as jest.Mock).mockReturnValue({ select: mockSelect })

    await expect(
      ProjectDetailPage({ params: Promise.resolve({ slug: "non-existent-project" }) })
    ).rejects.toThrow("NEXT_NOT_FOUND")
    expect(notFound).toHaveBeenCalled()
  })
})
