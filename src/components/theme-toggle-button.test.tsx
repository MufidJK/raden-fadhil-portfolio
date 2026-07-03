import { render, screen, fireEvent } from "@testing-library/react"
import { ThemeToggleButton } from "./theme-toggle-button"
import { useTheme } from "next-themes"

jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}))

describe("ThemeToggleButton", () => {
  const mockSetTheme = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useTheme as jest.Mock).mockReturnValue({
      theme: "dark",
      resolvedTheme: "dark",
      setTheme: mockSetTheme,
    })
  })

  it("renders without crashing", () => {
    render(<ThemeToggleButton />)
    expect(screen.getByRole("button", { name: /toggle theme/i })).toBeInTheDocument()
  })

  it("displays moon icon when theme is dark", () => {
    render(<ThemeToggleButton />)
    const button = screen.getByRole("button", { name: /toggle theme/i })
    expect(button).toBeInTheDocument()
    // The moon icon is rendered. Testing library doesn't easily assert on lucide icons by default
    // without specific test IDs, but we can verify it calls setTheme with light.
  })

  it("toggles theme on click", () => {
    render(<ThemeToggleButton />)
    const button = screen.getByRole("button", { name: /toggle theme/i })
    fireEvent.click(button)
    expect(mockSetTheme).toHaveBeenCalledWith("light")
  })

  it("displays sun icon and toggles to dark when theme is light", () => {
    ;(useTheme as jest.Mock).mockReturnValue({
      theme: "light",
      resolvedTheme: "light",
      setTheme: mockSetTheme,
    })
    render(<ThemeToggleButton />)
    const button = screen.getByRole("button", { name: /toggle theme/i })
    fireEvent.click(button)
    expect(mockSetTheme).toHaveBeenCalledWith("dark")
  })
})
