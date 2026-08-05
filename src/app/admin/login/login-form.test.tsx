import { render, screen } from "@testing-library/react";
import { LoginForm } from "./login-form";
import AdminLoginPage from "./page";

// Mock the server action module
jest.mock("./actions", () => ({
  loginAction: jest.fn(),
}));

describe("LoginForm Component", () => {
  it("renders the login card header, fields, and submit button", () => {
    render(<LoginForm />);

    expect(screen.getByText("Admin Portal")).toBeInTheDocument();
    expect(
      screen.getByText("Enter your credentials to access the precision portfolio admin suite.")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
  });
});

describe("AdminLoginPage Component", () => {
  it("renders the page container and login form", () => {
    render(<AdminLoginPage />);
    expect(screen.getByText("Admin Portal")).toBeInTheDocument();
  });
});
