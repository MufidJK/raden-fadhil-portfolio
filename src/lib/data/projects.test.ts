import {
  mapFallbackProjectToProjectRow,
  fallbackProjects,
  type Project,
} from "./projects"

jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn(),
  },
}))

describe("mapFallbackProjectToProjectRow", () => {
  it("correctly maps a fallback Project to a ProjectRow shape", () => {
    const sampleProject: Project = {
      id: "TEST_PROJ",
      title: "Test Hardware Node",
      slug: "test-hardware-node",
      description: "Sample hardware node description for unit testing.",
      tags: ["C++", "ESP32", "FreeRTOS"],
      category: "Embedded",
      link: "/projects/test-hardware-node",
      size: "medium",
      technicalSpecs: [
        { label: "MCU", value: "ESP32-S3" },
        { label: "Voltage", value: "3.3V" },
      ],
      media: [
        {
          id: "M1",
          type: "video",
          url: "/videos/test-demo.mp4",
          alt: "Test video demo",
        },
        {
          id: "M2",
          type: "image",
          url: "https://picsum.photos/seed/test/1920/1080",
          aiPrompt: "A macro view of custom hardware node",
        },
      ],
    }

    const mapped = mapFallbackProjectToProjectRow(sampleProject)

    expect(mapped.id).toBe("TEST_PROJ")
    expect(mapped.title).toBe("Test Hardware Node")
    expect(mapped.slug).toBe("test-hardware-node")
    expect(mapped.description).toBe("Sample hardware node description for unit testing.")
    expect(mapped.category).toBe("Embedded")

    // Check tags -> tech_stack mapping
    expect(mapped.tech_stack).toEqual(["C++", "ESP32", "FreeRTOS"])

    // Check technicalSpecs -> technical_specs Record mapping
    expect(mapped.technical_specs).toEqual({
      MCU: "ESP32-S3",
      Voltage: "3.3V",
    })

    // Check media -> project_media mapping
    expect(mapped.project_media).toHaveLength(2)
    expect(mapped.project_media[0]).toEqual({
      id: "M1",
      project_id: "TEST_PROJ",
      media_url: "/videos/test-demo.mp4",
      media_type: "video",
      caption: "Test video demo",
      sort_order: 0,
      created_at: null,
    })

    // Second media fallback to aiPrompt when alt is missing
    expect(mapped.project_media[1]).toEqual({
      id: "M2",
      project_id: "TEST_PROJ",
      media_url: "https://picsum.photos/seed/test/1920/1080",
      media_type: "image",
      caption: "A macro view of custom hardware node",
      sort_order: 1,
      created_at: null,
    })
  })

  it("maps actual fallbackProjects entries cleanly", () => {
    const homelab = fallbackProjects.find((p) => p.slug === "homelab-dashboard")
    expect(homelab).toBeDefined()

    if (homelab) {
      const mapped = mapFallbackProjectToProjectRow(homelab)
      expect(mapped.slug).toBe("homelab-dashboard")
      expect(mapped.title).toBe("Homelab Dashboard UI")
      expect(mapped.tech_stack).toEqual(["React", "Tailwind", "WebSocket"])
      expect(mapped.technical_specs).toHaveProperty("Ingest Rate", "5000 msg/sec")
      expect(mapped.project_media.length).toBeGreaterThanOrEqual(2)
      expect(mapped.project_media[0].sort_order).toBe(0)
    }
  })
})
