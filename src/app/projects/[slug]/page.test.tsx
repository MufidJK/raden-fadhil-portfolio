import { render, screen } from "@testing-library/react"
import ProjectDetailPage from "./page"
import { notFound } from "next/navigation"
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

describe("ProjectDetailPage", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the project details when a valid slug is provided", async () => {
    const jsx = await ProjectDetailPage({ params: Promise.resolve({ slug: "reptile-node-v2" }) })
    render(jsx)
    expect(screen.getByText("Terrarium Climate Controller v2")).toBeInTheDocument()
    expect(screen.getByText("ESP32-S3 WROOM")).toBeInTheDocument()
  })

  it("calls notFound when an invalid slug is provided", async () => {
    await expect(
      ProjectDetailPage({ params: Promise.resolve({ slug: "non-existent-project" }) })
    ).rejects.toThrow("NEXT_NOT_FOUND")
    expect(notFound).toHaveBeenCalled()
  })
})
