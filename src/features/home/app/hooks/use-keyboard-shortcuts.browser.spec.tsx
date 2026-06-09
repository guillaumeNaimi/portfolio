import { describe, expect, it } from "vitest";

import { isTypingTarget } from "./use-keyboard-shortcuts";

const makeEl = (
  tag: string,
  extra?: (el: HTMLElement) => void,
): HTMLElement => {
  const el = document.createElement(tag);
  extra?.(el);
  return el;
};

describe("isTypingTarget", () => {
  it("returns false for null", () => {
    expect(isTypingTarget(null)).toBe(false);
  });

  it("returns true for INPUT", () => {
    expect(isTypingTarget(makeEl("input"))).toBe(true);
  });

  it("returns true for TEXTAREA", () => {
    expect(isTypingTarget(makeEl("textarea"))).toBe(true);
  });

  it("returns true for SELECT", () => {
    expect(isTypingTarget(makeEl("select"))).toBe(true);
  });

  it("returns true for a contenteditable element", () => {
    expect(
      isTypingTarget(
        makeEl("div", (el) => el.setAttribute("contenteditable", "true")),
      ),
    ).toBe(true);
  });

  it("returns false for a regular div", () => {
    expect(isTypingTarget(makeEl("div"))).toBe(false);
  });

  it("returns false for a button", () => {
    expect(isTypingTarget(makeEl("button"))).toBe(false);
  });
});
