import { render, screen, fireEvent } from "@testing-library/react"
import { MediaCarousel } from "./media-carousel"
import type { ProjectMedia } from "@/lib/data/projects"

// Mock next/image to render a standard <img> tag for testing
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

const mockMedia: ProjectMedia[] = [
  {
    id: "TEST_M1",
    type: "image",
    url: "https://images.unsplash.com/photo-test-1",
    alt: "Test image one",
    aiPrompt: "A test AI prompt for image one.",
  },
  {
    id: "TEST_M2",
    type: "video",
    url: "/videos/test-video.mp4",
    alt: "Test video clip",
  },
  {
    id: "TEST_M3",
    type: "image",
    url: "https://images.unsplash.com/photo-test-2",
    alt: "Test image two",
  },
]

describe("MediaCarousel", () => {
  it("renders without crashing", () => {
    render(<MediaCarousel media={mockMedia} />)
    expect(screen.getByLabelText("Project media gallery")).toBeInTheDocument()
  })

  it("renders nothing when media array is empty", () => {
    const { container } = render(<MediaCarousel media={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it("renders the correct number of slides", () => {
    render(<MediaCarousel media={mockMedia} />)
    // Each media item has an aria-label starting with "View"
    const viewButtons = screen.getAllByLabelText(/^View /)
    const playButtons = screen.getAllByLabelText(/^Play /)
    expect(viewButtons.length + playButtons.length).toBe(mockMedia.length)
  })

  it("displays the first slide counter as 1/N", () => {
    render(<MediaCarousel media={mockMedia} />)
    expect(screen.getByText("1/3")).toBeInTheDocument()
  })

  it("shows the first slide caption", () => {
    render(<MediaCarousel media={mockMedia} />)
    expect(screen.getByText("Test image one")).toBeInTheDocument()
  })

  it("renders Next and Previous navigation buttons", () => {
    render(<MediaCarousel media={mockMedia} />)
    
    expect(screen.getByText("Next slide")).toBeInTheDocument()
    expect(screen.getByText("Previous slide")).toBeInTheDocument()
  })

  it("renders dot indicators for each slide", () => {
    render(<MediaCarousel media={mockMedia} />)

    const dots = screen.getAllByRole("tab")
    expect(dots).toHaveLength(mockMedia.length)
  })

  it("opens the lightbox dialog when clicking a media item", () => {
    render(<MediaCarousel media={mockMedia} />)

    // Click the first image to open the lightbox
    const viewButton = screen.getByLabelText("View Test image one")
    fireEvent.click(viewButton)

    // The lightbox should open with a dialog containing the full media view
    // The lightbox dialog should be rendered
    const dialog = screen.getByRole("dialog")
    expect(dialog).toBeInTheDocument()
  })

  it("renders video placeholders with play button", () => {
    render(<MediaCarousel media={mockMedia} />)

    // The second item is a video, check for its alt text label
    const videoButton = screen.getByLabelText("Play Test video clip")
    expect(videoButton).toBeInTheDocument()
  })

  it("renders images using Next.js Image component", () => {
    render(<MediaCarousel media={mockMedia} />)

    // Check that images are rendered with alt text
    const images = screen.getAllByAltText("Test image one")
    expect(images.length).toBeGreaterThanOrEqual(1)
  })
})
