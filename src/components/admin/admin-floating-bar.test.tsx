import { render, screen, fireEvent } from "@testing-library/react"
import { AdminFloatingBar } from "./admin-floating-bar"

// ── Render Test ──
describe("AdminFloatingBar", () => {
  const defaultProps = {
    isEditMode: false,
    isSaving: false,
    onToggleEdit: jest.fn(),
    onDelete: jest.fn(),
    onSave: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders without crashing", () => {
    render(<AdminFloatingBar {...defaultProps} />)
    expect(screen.getByRole("toolbar")).toBeInTheDocument()
  })

  it("shows 'Enable Edit Mode' button when not in edit mode", () => {
    render(<AdminFloatingBar {...defaultProps} isEditMode={false} />)
    expect(screen.getByText("Enable Edit Mode")).toBeInTheDocument()
  })

  it("shows 'Cancel Edit' button when in edit mode", () => {
    render(<AdminFloatingBar {...defaultProps} isEditMode={true} />)
    expect(screen.getByText("Cancel Edit")).toBeInTheDocument()
  })

  it("shows Save button only in edit mode", () => {
    const { rerender } = render(<AdminFloatingBar {...defaultProps} isEditMode={false} />)
    expect(screen.queryByText("Save Changes")).not.toBeInTheDocument()

    rerender(<AdminFloatingBar {...defaultProps} isEditMode={true} />)
    expect(screen.getByText("Save Changes")).toBeInTheDocument()
  })

  it("always shows Delete button", () => {
    render(<AdminFloatingBar {...defaultProps} />)
    expect(screen.getByText("Delete Project")).toBeInTheDocument()
  })

  // ── Interaction Tests ──
  it("calls onToggleEdit when edit button is clicked", () => {
    render(<AdminFloatingBar {...defaultProps} />)
    fireEvent.click(screen.getByText("Enable Edit Mode"))
    expect(defaultProps.onToggleEdit).toHaveBeenCalledTimes(1)
  })

  it("calls onDelete when delete button is clicked", () => {
    render(<AdminFloatingBar {...defaultProps} />)
    fireEvent.click(screen.getByText("Delete Project"))
    expect(defaultProps.onDelete).toHaveBeenCalledTimes(1)
  })

  it("calls onSave when save button is clicked in edit mode", () => {
    render(<AdminFloatingBar {...defaultProps} isEditMode={true} />)
    fireEvent.click(screen.getByText("Save Changes"))
    expect(defaultProps.onSave).toHaveBeenCalledTimes(1)
  })

  it("disables all buttons when isSaving is true", () => {
    render(<AdminFloatingBar {...defaultProps} isEditMode={true} isSaving={true} />)
    const buttons = screen.getAllByRole("button")
    buttons.forEach((button) => {
      expect(button).toBeDisabled()
    })
  })

  it("shows 'Saving...' text when isSaving is true in edit mode", () => {
    render(<AdminFloatingBar {...defaultProps} isEditMode={true} isSaving={true} />)
    expect(screen.getByText("Saving...")).toBeInTheDocument()
  })
})
