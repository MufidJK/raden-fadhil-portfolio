import { render, screen } from "@testing-library/react"
import ProjectDetailPage from "./page"
import { notFound } from "next/navigation"
import React from "react"

jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}))

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={props.alt || ""} {...props} />
  },
}))

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
    await ProjectDetailPage({ params: Promise.resolve({ slug: "non-existent-project" }) })
    expect(notFound).toHaveBeenCalled()
  })
})
