import "@testing-library/jest-dom"

if (typeof window !== 'undefined') {
  if (!window.PointerEvent) {
    class PointerEvent extends Event {
      pointerId: number;
      clientX: number;
      clientY: number;
      constructor(type: string, props: Record<string, unknown>) {
        super(type, props as EventInit);
        this.pointerId = (props.pointerId as number) || 0;
        this.clientX = (props.clientX as number) || 0;
        this.clientY = (props.clientY as number) || 0;
      }
    }
    window.PointerEvent = PointerEvent as unknown as typeof window.PointerEvent;
  }
}

Element.prototype.setPointerCapture = jest.fn();
Element.prototype.releasePointerCapture = jest.fn();

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

class MockIntersectionObserver {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

class MockResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: MockResizeObserver,
});

Object.defineProperty(global, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: MockResizeObserver,
});
