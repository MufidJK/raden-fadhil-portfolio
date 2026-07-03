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
