// matchmaking test
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react"; // importing testing lib
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import Matchmaking from "./Matchmaking";

// mockingaxios
vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

// mocking use navigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  ...require("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Matchmaking Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // checking if the error message is displayed when the username is missing
  it("displays an error message if username is missing", async () => {
    document.cookie = ""; // No username in cookies
    render(
      <MemoryRouter>
        <Matchmaking />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/username not found in cookies\./i)
      ).toBeInTheDocument();
    });
  });

  // checking no more jobs alert shows up when no jobs are available
  it("displays 'No more jobs' when no jobs are available", async () => {
    document.cookie = "username=testuser";
    axios.get.mockResolvedValueOnce({
      data: { success: true, jobs: [], alreadySwiped: [] },
    });

    render(
      <MemoryRouter>
        <Matchmaking />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/no more jobs to display/i)).toBeInTheDocument();
    });
  });

  // checking if the job is displayed correctly
  it("navigates back to home", async () => {
    render(
      <MemoryRouter>
        <Matchmaking />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/back to home/i));
    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });
});
