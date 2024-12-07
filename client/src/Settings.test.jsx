import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // importing memory router
import Settings from "./Settings"; // importing settings   
import Cookies from "js-cookie";

// mocking js-cookie methods
vi.mock("js-cookie", () => {
  return {
    __esModule: true,
    default: {
      get: vi.fn(),
      set: vi.fn(),
    },
  };
});

describe("Settings Component - Font Size", () => {
  beforeEach(() => {
    Cookies.get.mockImplementation((key) => {
      if (key === "fontSize") return "Medium"; // the default font sizz
      return null;
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // checking if the font size change correctly
  it("should change font size correctly", () => {
    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    );

    const fontSizeSelector = screen.getByLabelText(/choose font size:/i);
    const bodyStyle = document.body.style;

    // default font size
    expect(fontSizeSelector.value).toBe("Medium");
    expect(bodyStyle.fontSize).toBe("18px");

    // changing to small font size
    fireEvent.change(fontSizeSelector, { target: { value: "Small" } });
    expect(fontSizeSelector.value).toBe("Small");
    expect(Cookies.set).toHaveBeenCalledWith("fontSize", "Small", { expires: 7 });
    expect(bodyStyle.fontSize).toBe("14px");

    // change to large font size
    fireEvent.change(fontSizeSelector, { target: { value: "Large" } });
    expect(fontSizeSelector.value).toBe("Large");
    expect(Cookies.set).toHaveBeenCalledWith("fontSize", "Large", { expires: 7 });
    expect(bodyStyle.fontSize).toBe("24px");
  });
});
