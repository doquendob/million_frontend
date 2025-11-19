import { renderHook, act } from "@testing-library/react";
import { useToast } from "../useToast";

describe("useToast", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("adds a success toast", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success("Success", "Operation completed successfully");
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]).toMatchObject({
      type: "success",
      title: "Success",
      message: "Operation completed successfully",
    });
  });

  it("adds an error toast", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.error("Error", "Something went wrong");
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]).toMatchObject({
      type: "error",
      title: "Error",
      message: "Something went wrong",
    });
  });

  it("adds a warning toast", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.warning("Warning", "Please be careful");
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]).toMatchObject({
      type: "warning",
      title: "Warning",
      message: "Please be careful",
    });
  });

  it("adds an info toast", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.info("Info", "Here is some information");
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]).toMatchObject({
      type: "info",
      title: "Info",
      message: "Here is some information",
    });
  });

  it("removes toast by ID", () => {
    const { result } = renderHook(() => useToast());

    let toastId: string;

    act(() => {
      toastId = result.current.success("Test", "Test message");
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      result.current.removeToast(toastId);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it("auto-removes toast after duration", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success("Test", "Test message", 3000);
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it("does not auto-remove toast when duration is 0", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success("Test", "Test message", 0);
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(result.current.toasts).toHaveLength(1);
  });

  it("handles multiple toasts", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success("Success 1", "First success");
      result.current.error("Error 1", "First error");
      result.current.warning("Warning 1", "First warning");
    });

    expect(result.current.toasts).toHaveLength(3);
    expect(result.current.toasts[0].type).toBe("success");
    expect(result.current.toasts[1].type).toBe("error");
    expect(result.current.toasts[2].type).toBe("warning");
  });

  it("creates error toast from API error", () => {
    const { result } = renderHook(() => useToast());

    const apiError = {
      message: "Property not found",
      statusCode: 404,
    };

    act(() => {
      result.current.errorFromApi(apiError);
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].type).toBe("warning"); // 404 is client error, not server error
    expect(result.current.toasts[0].message).toContain("not found");
  });

  it("creates error toast for server errors", () => {
    const { result } = renderHook(() => useToast());

    const apiError = {
      message: "Internal server error",
      statusCode: 500,
    };

    act(() => {
      result.current.errorFromApi(apiError);
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].type).toBe("error"); // 500+ are server errors
    expect(result.current.toasts[0].title).toBe("Server Error");
  });

  it("allows custom message for API errors", () => {
    const { result } = renderHook(() => useToast());

    const apiError = {
      message: "Server error",
      statusCode: 500,
    };

    act(() => {
      result.current.errorFromApi(apiError, "Failed to save property");
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe("Failed to save property");
  });

  it("generates unique IDs for toasts", () => {
    const { result } = renderHook(() => useToast());

    let id1 = "";
    let id2 = "";

    act(() => {
      id1 = result.current.success("Test 1", "Message 1");
      id2 = result.current.success("Test 2", "Message 2");
    });

    expect(id1).not.toBe(id2);
    expect(result.current.toasts[0].id).toBe(id1);
    expect(result.current.toasts[1].id).toBe(id2);
  });
});
