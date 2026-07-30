import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import {
  MediaDropzone,
  getVideoDuration,
  MAX_FILE_SIZE_BYTES,
  MAX_FILES,
  MAX_VIDEO_DURATION_SECONDS,
  ValidatedMediaFile,
} from "./media-dropzone"
import { toast } from "sonner"

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    warning: jest.fn(),
  },
}))

describe("MediaDropzone Validation & State Logic", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock URL.createObjectURL and URL.revokeObjectURL
    global.URL.createObjectURL = jest.fn(() => "blob:http://localhost/dummy-url")
    global.URL.revokeObjectURL = jest.fn()
  })

  it("renders dropzone and rule indicators correctly", () => {
    const setMediaFiles = jest.fn()
    render(<MediaDropzone mediaFiles={[]} setMediaFiles={setMediaFiles} />)

    expect(screen.getByText(/Drag & drop media files here, or click to browse/i)).toBeInTheDocument()
    expect(screen.getByText(/Active Validation Rules:/i)).toBeInTheDocument()
    expect(screen.getAllByText(/50MB per file/i).length).toBeGreaterThan(0)
  })

  it("rejects files with invalid MIME types", async () => {
    const setMediaFiles = jest.fn()
    render(<MediaDropzone mediaFiles={[]} setMediaFiles={setMediaFiles} />)

    const invalidFile = new File(["dummy"], "document.pdf", { type: "application/pdf" })
    const input = screen.getByLabelText("Upload media files") as HTMLInputElement

    fireEvent.change(input, { target: { files: [invalidFile] } })

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining('Rejected "document.pdf": Unsupported format')
      )
    })
  })

  it("rejects files exceeding 50MB size limit", async () => {
    const setMediaFiles = jest.fn()
    render(<MediaDropzone mediaFiles={[]} setMediaFiles={setMediaFiles} />)

    const oversizedFile = new File(["a".repeat(100)], "heavy.png", { type: "image/png" })
    Object.defineProperty(oversizedFile, "size", { value: 60 * 1024 * 1024 }) // 60MB

    const input = screen.getByLabelText("Upload media files") as HTMLInputElement
    fireEvent.change(input, { target: { files: [oversizedFile] } })

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining('Rejected "heavy.png": Size (60.0MB) exceeds the 50MB limit.')
      )
    })
  })

  it("prevents adding more than 5 total files", async () => {
    const setMediaFiles = jest.fn()
    const dummyExistingFiles: ValidatedMediaFile[] = Array.from({ length: 5 }, (_, i) => ({
      id: `existing-${i}`,
      file: new File([""], `image-${i}.png`, { type: "image/png" }),
      type: "image",
      previewUrl: `blob:dummy-${i}`,
      caption: "",
    }))

    render(<MediaDropzone mediaFiles={dummyExistingFiles} setMediaFiles={setMediaFiles} />)

    const extraFile = new File(["img"], "extra.png", { type: "image/png" })
    const input = document.getElementById("media-dropzone-input") as HTMLInputElement

    fireEvent.change(input, { target: { files: [extraFile] } })

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Maximum limit of 5 media files already reached.")
    })
  })

  it("accepts valid image files and calls setMediaFiles", async () => {
    const setMediaFiles = jest.fn()
    render(<MediaDropzone mediaFiles={[]} setMediaFiles={setMediaFiles} />)

    const validImage = new File(["valid-image"], "photo.jpeg", { type: "image/jpeg" })
    const input = document.getElementById("media-dropzone-input") as HTMLInputElement

    fireEvent.change(input, { target: { files: [validImage] } })

    await waitFor(() => {
      expect(setMediaFiles).toHaveBeenCalled()
      expect(toast.success).toHaveBeenCalledWith("Successfully added 1 file(s).")
    })
  })

  describe("Video Duration Validation", () => {
    it("rejects videos exceeding 30 seconds duration limit", async () => {
      const setMediaFiles = jest.fn()

      // Mock document.createElement to simulate HTML5 Video element with 45s duration
      const originalCreateElement = document.createElement.bind(document)
      jest.spyOn(document, "createElement").mockImplementation((tagName: string) => {
        if (tagName === "video") {
          const videoMock: Partial<HTMLVideoElement> = {
            duration: 45, // Exceeds 30s limit
            set src(_val: string) {
              setTimeout(() => {
                const handler = this.onloadedmetadata
                if (handler) {
                  handler.call(this as unknown as HTMLVideoElement, {} as Event)
                }
              }, 10)
            },
          }
          return videoMock as HTMLVideoElement
        }
        return originalCreateElement(tagName)
      })

      render(<MediaDropzone mediaFiles={[]} setMediaFiles={setMediaFiles} />)

      const longVideo = new File(["video-bytes"], "long-demo.mp4", { type: "video/mp4" })
      const input = document.getElementById("media-dropzone-input") as HTMLInputElement

      fireEvent.change(input, { target: { files: [longVideo] } })

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          expect.stringContaining('Rejected "long-demo.mp4": Video duration (45s) exceeds the strict 30-second limit.')
        )
      })

      jest.restoreAllMocks()
    })

    it("accepts videos under 30 seconds duration limit", async () => {
      const setMediaFiles = jest.fn()

      const originalCreateElement = document.createElement.bind(document)
      jest.spyOn(document, "createElement").mockImplementation((tagName: string) => {
        if (tagName === "video") {
          const videoMock: Partial<HTMLVideoElement> = {
            duration: 15, // Valid duration
            set src(_val: string) {
              setTimeout(() => {
                const handler = this.onloadedmetadata
                if (handler) {
                  handler.call(this as unknown as HTMLVideoElement, {} as Event)
                }
              }, 10)
            },
          }
          return videoMock as HTMLVideoElement
        }
        return originalCreateElement(tagName)
      })

      render(<MediaDropzone mediaFiles={[]} setMediaFiles={setMediaFiles} />)

      const validVideo = new File(["video-bytes"], "short-clip.mp4", { type: "video/mp4" })
      const input = document.getElementById("media-dropzone-input") as HTMLInputElement

      fireEvent.change(input, { target: { files: [validVideo] } })

      await waitFor(() => {
        expect(setMediaFiles).toHaveBeenCalled()
        expect(toast.success).toHaveBeenCalledWith("Successfully added 1 file(s).")
      })

      jest.restoreAllMocks()
    })
  })
})
