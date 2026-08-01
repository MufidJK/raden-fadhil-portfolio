import { render, screen, fireEvent } from "@testing-library/react"
import { DeleteConfirmDialog } from "./delete-confirm-dialog"

// Mock Radix Dialog to render content unconditionally in tests
jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog">{children}</div>,
  DialogContent: ({ children, ...props }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="dialog-content" {...props}>{children}</div>
  ),
  DialogTrigger: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}))

describe("DeleteConfirmDialog", () => {
  const defaultProps = {
    projectTitle: "Test Project Alpha",
    isOpen: true,
    isDeleting: false,
    onOpenChange: jest.fn(),
    onConfirm: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // ── Render Tests ──
  it("renders without crashing", () => {
    render(<DeleteConfirmDialog {...defaultProps} />)
    expect(screen.getByTestId("dialog")).toBeInTheDocument()
  })

  it("displays the project title in the confirmation message", () => {
    render(<DeleteConfirmDialog {...defaultProps} />)
    expect(screen.getByText(/Test Project Alpha/)).toBeInTheDocument()
  })

  it("displays the destructive action header", () => {
    render(<DeleteConfirmDialog {...defaultProps} />)
    expect(screen.getByRole("heading", { name: /Hapus Project/i })).toBeInTheDocument()
    expect(screen.getByText("DESTRUCTIVE ACTION")).toBeInTheDocument()
  })

  it("displays the irreversibility warning", () => {
    render(<DeleteConfirmDialog {...defaultProps} />)
    expect(screen.getByText(/tidak dapat dibatalkan/)).toBeInTheDocument()
  })

  // ── Interaction Tests ──
  it("calls onConfirm when confirm button is clicked", () => {
    render(<DeleteConfirmDialog {...defaultProps} />)
    const confirmButton = screen.getByRole("button", { name: /Hapus Project/i })
    fireEvent.click(confirmButton)
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1)
  })

  it("calls onOpenChange(false) when cancel button is clicked", () => {
    render(<DeleteConfirmDialog {...defaultProps} />)
    const cancelButton = screen.getByRole("button", { name: /Batal/i })
    fireEvent.click(cancelButton)
    expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false)
  })

  // ── State Tests ──
  it("disables buttons and shows loading state when isDeleting is true", () => {
    render(<DeleteConfirmDialog {...defaultProps} isDeleting={true} />)
    expect(screen.getByText("Menghapus...")).toBeInTheDocument()

    const buttons = screen.getAllByRole("button")
    buttons.forEach((button) => {
      expect(button).toBeDisabled()
    })
  })

  it("shows 'Hapus Project' on confirm button when not deleting", () => {
    render(<DeleteConfirmDialog {...defaultProps} isDeleting={false} />)
    expect(screen.getByRole("button", { name: /Hapus Project/i })).toBeInTheDocument()
  })
})
