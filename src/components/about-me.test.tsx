import React from "react"
import { render, screen } from "@testing-library/react"
import { AboutMe } from "./about-me"

describe("AboutMe Component", () => {
  it("renders correctly without crashing", () => {
    render(<AboutMe />)
    expect(screen.getByText("About Me")).toBeInTheDocument()
  })

  it("renders the GitHub and LinkedIn links", () => {
    render(<AboutMe />)
    expect(screen.getByText("GitHub")).toBeInTheDocument()
    expect(screen.getByText("LinkedIn")).toBeInTheDocument()
  })
})
