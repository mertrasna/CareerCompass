import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import Post from "./Post";

// Mocking axios
jest.mock("axios");

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // Preserve other functionality
  useNavigate: jest.fn(), // Mock useNavigate
}));

// Mock localStorage for testing
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => (store[key] = value.toString()),
    clear: () => (store = {}),
  };
})();
Object.defineProperty(global, "localStorage", { value: localStorageMock });

describe("Post Component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    require("react-router-dom").useNavigate.mockReturnValue(mockNavigate); // Reset mock navigate
    localStorage.setItem("employerId", "testEmployerId"); // Set mock employer ID in localStorage
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks after each test
    localStorage.clear(); // Clear localStorage after each test
  });

  test("renders form fields correctly", () => {
    render(
      <MemoryRouter>
        <Post />
      </MemoryRouter>
    );

    // Check for form inputs
    expect(screen.getByLabelText("Job Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Location")).toBeInTheDocument();
    expect(screen.getByLabelText("Job Type")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Company Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Company Logo")).toBeInTheDocument();
    expect(screen.getByLabelText("Salary Range")).toBeInTheDocument();
    expect(screen.getByLabelText("Application Deadline")).toBeInTheDocument();
  });

  test("allows adding requirements and skills", () => {
    render(
      <MemoryRouter>
        <Post />
      </MemoryRouter>
    );

    const addRequirementButton = screen.getByText("Add Requirement");
    const addSkillButton = screen.getByText("Add Skill");

    // Click add requirement
    fireEvent.click(addRequirementButton);
    expect(screen.getAllByPlaceholderText(/Requirement/i)).toHaveLength(2);

    // Click add skill
    fireEvent.click(addSkillButton);
    expect(screen.getAllByPlaceholderText(/Skill/i)).toHaveLength(2);
  });

  test("submits the form with valid data", async () => {
    axios.post.mockResolvedValueOnce({ data: { success: true } }); // Mock successful response

    render(
      <MemoryRouter>
        <Post />
      </MemoryRouter>
    );

    // Fill out the form
    fireEvent.change(screen.getByLabelText("Job Title"), { target: { value: "Test Job" } });
    fireEvent.change(screen.getByLabelText("Location"), { target: { value: "Remote" } });
    fireEvent.change(screen.getByLabelText("Job Type"), { target: { value: "Full-Time" } });
    fireEvent.change(screen.getByLabelText("Description"), { target: { value: "Job description here" } });
    fireEvent.change(screen.getByLabelText("Company Name"), { target: { value: "Test Company" } });
    fireEvent.change(screen.getByLabelText("Application Deadline"), { target: { value: "2024-12-31" } });

    // Submit the form
    fireEvent.click(screen.getByText("Post Job"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:3001/posts",
        expect.any(FormData),
        expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "multipart/form-data",
            username: "Barreett57",
          }),
        })
      );
      expect(mockNavigate).toHaveBeenCalledWith("/home");
    });
  });

  test("handles form submission error", async () => {
    axios.post.mockRejectedValueOnce(new Error("Failed to create job post"));

    render(
      <MemoryRouter>
        <Post />
      </MemoryRouter>
    );

    // Fill out the form
    fireEvent.change(screen.getByLabelText("Job Title"), { target: { value: "Test Job" } });
    fireEvent.change(screen.getByLabelText("Location"), { target: { value: "Remote" } });
    fireEvent.change(screen.getByLabelText("Job Type"), { target: { value: "Full-Time" } });
    fireEvent.change(screen.getByLabelText("Description"), { target: { value: "Job description here" } });
    fireEvent.change(screen.getByLabelText("Company Name"), { target: { value: "Test Company" } });
    fireEvent.change(screen.getByLabelText("Application Deadline"), { target: { value: "2024-12-31" } });

    // Submit the form
    fireEvent.click(screen.getByText("Post Job"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(screen.getByText("Failed to create job post. Please try again.")).toBeInTheDocument();
    });
  });
});
npm