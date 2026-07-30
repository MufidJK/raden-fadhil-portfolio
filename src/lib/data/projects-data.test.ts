import {
  mapSupabaseProject,
  fetchProjects,
  SupabaseProject,
} from "./projects"

jest.mock("@/lib/supabase", () => {
  const mockSelect = jest.fn()
  const mockOrder = jest.fn()
  const mockFrom = jest.fn(() => ({
    select: mockSelect.mockReturnValue({
      order: mockOrder,
    }),
  }))

  return {
    supabase: {
      from: mockFrom,
    },
    __mocks: { mockFrom, mockSelect, mockOrder },
  }
})

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { __mocks } = require("@/lib/supabase") as {
  __mocks: {
    mockFrom: jest.Mock
    mockSelect: jest.Mock
    mockOrder: jest.Mock
  }
}

const sampleRow: SupabaseProject = {
  id: "f767b3cd-3b8a-4429-af84-e8d80dbd0aa7",
  title: "Test Project",
  slug: "test-project",
  description: "A test description",
  technical_specs: { Microcontroller: "ESP32", Watt: "67 Watt" },
  created_at: "2026-07-28T17:24:32.346993+00",
  updated_at: "2026-07-28T17:24:32.346993+00",
  category: "Game",
  tech_stack: ["React", "TypeScript"],
}

describe("mapSupabaseProject", () => {
  it("transforms slug to uppercase underscored id", () => {
    const result = mapSupabaseProject(sampleRow, 0, 1)
    expect(result.id).toBe("TEST_PROJECT")
  })

  it("maps tech_stack to tags", () => {
    const result = mapSupabaseProject(sampleRow, 0, 1)
    expect(result.tags).toEqual(["React", "TypeScript"])
  })

  it("constructs link from slug", () => {
    const result = mapSupabaseProject(sampleRow, 0, 1)
    expect(result.link).toBe("/projects/test-project")
  })

  it("transforms technical_specs jsonb to label/value array", () => {
    const result = mapSupabaseProject(sampleRow, 0, 1)
    expect(result.technicalSpecs).toEqual(
      expect.arrayContaining([
        { label: "Microcontroller", value: "ESP32" },
        { label: "Watt", value: "67 Watt" },
      ])
    )
  })

  it("assigns 'wide' size to edge indices", () => {
    const first = mapSupabaseProject(sampleRow, 0, 3)
    const last = mapSupabaseProject(sampleRow, 2, 3)
    expect(first.size).toBe("wide")
    expect(last.size).toBe("wide")
  })

  it("assigns 'medium' size to middle indices", () => {
    const middle = mapSupabaseProject(sampleRow, 1, 3)
    expect(middle.size).toBe("medium")
  })

  it("defaults null fields gracefully", () => {
    const nullRow: SupabaseProject = {
      ...sampleRow,
      description: null,
      category: null,
      tech_stack: null,
      technical_specs: null,
    }
    const result = mapSupabaseProject(nullRow, 0, 1)
    expect(result.description).toBe("")
    expect(result.category).toBe("Uncategorized")
    expect(result.tags).toEqual([])
    expect(result.technicalSpecs).toEqual([])
    expect(result.media).toEqual([])
  })
})

describe("fetchProjects", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("returns mapped projects on success", async () => {
    __mocks.mockOrder.mockResolvedValue({
      data: [sampleRow],
      error: null,
    })

    const result = await fetchProjects()
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe("Test Project")
    expect(__mocks.mockFrom).toHaveBeenCalledWith("projects")
  })

  it("returns empty array when Supabase returns an error", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined)

    __mocks.mockOrder.mockResolvedValue({
      data: null,
      error: { message: "connection refused" },
    })

    const result = await fetchProjects()
    expect(result).toEqual([])
    expect(consoleSpy).toHaveBeenCalledWith(
      "[fetchProjects] Supabase query failed:",
      "connection refused"
    )

    consoleSpy.mockRestore()
  })

  it("returns empty array when data is empty", async () => {
    __mocks.mockOrder.mockResolvedValue({
      data: [],
      error: null,
    })

    const result = await fetchProjects()
    expect(result).toEqual([])
  })

  it("returns empty array on unexpected thrown error", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined)

    __mocks.mockOrder.mockRejectedValue(new Error("Network failure"))

    const result = await fetchProjects()
    expect(result).toEqual([])
    expect(consoleSpy).toHaveBeenCalledWith(
      "[fetchProjects] Unexpected error:",
      "Network failure"
    )

    consoleSpy.mockRestore()
  })
})
