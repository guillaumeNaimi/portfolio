import * as module from "react-i18next";
import { describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { page, render } from "@/tests/utils";

import { KeyboardShortcutsPanel } from "./keyboard-shortcuts-panel";

vi.mock("react-i18next", { spy: true });
vi.mocked(module.useTranslation).mockImplementation(
  // @ts-expect-error lightweight mock
  () => ({ t: (key: string) => key }),
);

describe("KeyboardShortcutsPanel", () => {
  it("renders all shortcut rows when open", async () => {
    render(<KeyboardShortcutsPanel open onOpenChange={() => {}} />);

    await expect.element(page.getByText("shortcuts.title")).toBeVisible();
    await expect.element(page.getByText("shortcuts.copy")).toBeVisible();
    await expect.element(page.getByText("shortcuts.download")).toBeVisible();
    await expect.element(page.getByText("shortcuts.experience")).toBeVisible();
    await expect.element(page.getByText("shortcuts.help")).toBeVisible();
  });

  it("renders kbd key badges for each shortcut", async () => {
    render(<KeyboardShortcutsPanel open onOpenChange={() => {}} />);

    for (const key of ["C", "D", "E", "?"]) {
      await expect
        .element(page.getByText(key, { exact: true }).first())
        .toBeVisible();
    }
  });

  it("is not visible when closed", async () => {
    render(<KeyboardShortcutsPanel open={false} onOpenChange={() => {}} />);

    await expect
      .element(page.getByText("shortcuts.title"))
      .not.toBeInTheDocument();
  });

  it("calls onOpenChange when Escape is pressed", async () => {
    const onOpenChange = vi.fn();
    render(<KeyboardShortcutsPanel open onOpenChange={onOpenChange} />);

    await userEvent.keyboard("{Escape}");

    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });
});
