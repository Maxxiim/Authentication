import { expect, vi, it, describe, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

import { authApi } from "../../api/authApi";
import Authorization from "./Authorization";

vi.mock("../../api/authApi", () => ({
  authApi: {
    login: vi.fn(),
  },
}));

describe("Authorization", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("submits form", async () => {
    const user = userEvent.setup();
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    vi.mocked(authApi.login).mockResolvedValue({
      token: "token-json",
    });

    render(
      <MemoryRouter>
        <Authorization />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/логин/i), "Alex");
    await user.type(screen.getByLabelText(/пароль/i), "123456");
    await user.click(screen.getByRole("button", { name: /войти/i }));

    expect(authApi.login).toHaveBeenCalledTimes(1);
    expect(authApi.login).toHaveBeenCalledWith({
      name: "Alex",
      password: "123456",
    });
    expect(alertMock).toHaveBeenCalled();
  });

  it("Unsuccessful", async () => {
    const user = userEvent.setup();

    vi.mocked(authApi.login).mockResolvedValue({
      message: "Ошибка входа",
    });

    render(
      <MemoryRouter>
        <Authorization />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/логин/i), "wrong");
    await user.type(screen.getByLabelText(/пароль/i), "wrong");
    await user.click(screen.getByRole("button", { name: /войти/i }));

    expect(await screen.findByText(/ошибка входа/i)).toBeInTheDocument();
  });
});