import { render, screen, act } from "@testing-library/react"
import { ScrollReveal } from "./scroll-reveal"

describe("ScrollReveal", () => {
  let observeMock: jest.Mock
  let unobserveMock: jest.Mock

  beforeEach(() => {
    observeMock = jest.fn()
    unobserveMock = jest.fn()

    window.IntersectionObserver = jest.fn().mockImplementation((callback) => ({
      observe: observeMock,
      unobserve: unobserveMock,
      disconnect: jest.fn(),
      // Attach callback so we can simulate intersection manually in tests
      _trigger: callback
    })) as unknown as typeof window.IntersectionObserver
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders children correctly", () => {
    render(
      <ScrollReveal>
        <div data-testid="child">Test Child</div>
      </ScrollReveal>
    )
    expect(screen.getByTestId("child")).toBeInTheDocument()
  })

  it("applies initial hidden classes", () => {
    render(
      <ScrollReveal>
        <div data-testid="child">Test Child</div>
      </ScrollReveal>
    )
    
    // Parent wrapper should have initial state
    const wrapper = screen.getByTestId("child").parentElement
    expect(wrapper).toHaveClass("opacity-0", "translate-y-8")
  })

  it("applies visible classes when intersected", () => {
    jest.useFakeTimers()
    
    render(
      <ScrollReveal>
        <div data-testid="child">Test Child</div>
      </ScrollReveal>
    )

    const wrapper = screen.getByTestId("child").parentElement
    expect(wrapper).toHaveClass("opacity-0")

    // Trigger intersection
    const observerInstance = (window.IntersectionObserver as jest.Mock).mock.results[0].value
    act(() => {
      observerInstance._trigger([{ isIntersecting: true }])
      jest.runAllTimers()
    })

    expect(wrapper).toHaveClass("opacity-100", "translate-y-0")
    expect(wrapper).not.toHaveClass("opacity-0", "translate-y-8")
    
    jest.useRealTimers()
  })

  it("applies visible classes on mount without scroll when trigger='onMount'", () => {
    jest.useFakeTimers()
    
    render(
      <ScrollReveal trigger="onMount" delay={200}>
        <div data-testid="child-mount">Test Child</div>
      </ScrollReveal>
    )

    const wrapper = screen.getByTestId("child-mount").parentElement
    expect(wrapper).toHaveClass("opacity-0")

    act(() => {
      jest.advanceTimersByTime(200)
    })

    expect(wrapper).toHaveClass("opacity-100", "translate-y-0")
    
    // Ensure IntersectionObserver wasn't used
    expect(observeMock).not.toHaveBeenCalled()

    jest.useRealTimers()
  })
})
