import { vi, it, expect, beforeEach, describe } from "vitest";
import userEvent from "@testing-library/user-event";
import { screen, render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { authApi } from "../../api/authApi";
import Registration from "./Registration";

vi.mock("../../api/authApi", () => ({
  authApi: {
    registration: vi.fn(),
  },
}));

describe("Registration", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("success registration", async () => {
    const user = userEvent.setup();

    vi.mocked(authApi.registration).mockResolvedValue({
      token: "123",
    });

    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(
      <MemoryRouter>
        <Registration />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/логин/i), "random");
    await user.type(screen.getByLabelText(/email/i), "random@mail.ru");
    await user.type(screen.getByLabelText(/^пароль$/i), "1234567a");
    await user.type(screen.getByLabelText(/подтвердить пароль/i), "1234567a");

    await user.click(screen.getByRole("button", { name: /регистрация/i }));

    expect(alertMock).toHaveBeenCalled();
  });

  it("error handling with name ", async () => {
    const user = userEvent.setup();

    vi.mocked(authApi.registration).mockResolvedValue({
      fields: ["name"],
      message: "Пользователь с таким именем уже существует.",
    });

    render(
      <MemoryRouter>
        <Registration />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText("Логин"), "Alex");
    await user.type(screen.getByLabelText("Email"), "test@mail.ru");
    await user.type(screen.getByLabelText("Пароль"), "pass123");
    await user.type(screen.getByLabelText("Подтвердить пароль"), "pass123");
    await user.click(screen.getByRole("button", { name: "Регистрация" }));

    await waitFor(() => {
      expect(screen.getByText("Пользователь с таким именем уже существует."));
    });
  });

  it("error handling with email", async () => {
    const user = userEvent.setup();

    vi.mocked(authApi.registration).mockResolvedValue({
      fields: ["email"],
      message: "Пользователь с таким email уже существует.",
    });

    render(
      <MemoryRouter>
        <Registration />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText("Логин"), "Alex");
    await user.type(screen.getByLabelText("Email"), "test@mail.ru");
    await user.type(screen.getByLabelText("Пароль"), "pass123");
    await user.type(screen.getByLabelText("Подтвердить пароль"), "pass123");
    await user.click(screen.getByRole("button", { name: "Регистрация" }));

    await waitFor(() => {
      screen.getByText("Пользователь с таким email уже существует.");
    });
  });

  it("error handling with name and email", async () => {
    const user = userEvent.setup();

    vi.mocked(authApi.registration).mockResolvedValue({
      fields: ["name", "email"],
      message: "Пользователь с таким именем и email уже существует.",
    });

    render(
      <MemoryRouter>
        <Registration />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText("Логин"), "Alex");
    await user.type(screen.getByLabelText("Email"), "test@mail.ru");
    await user.type(screen.getByLabelText("Пароль"), "pass123");
    await user.type(screen.getByLabelText("Подтвердить пароль"), "pass123");
    await user.click(screen.getByRole("button", { name: "Регистрация" }));

    await waitFor(() => {
      screen.getByText("Пользователь с таким именем и email уже существует.");
    });
  });
});
