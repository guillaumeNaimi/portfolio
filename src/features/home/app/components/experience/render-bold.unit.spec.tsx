import React from "react";
import { describe, expect, it } from "vitest";

import { renderBold } from "./render-bold";

describe("renderBold", () => {
  it("returns a single-element array for text with no markers", () => {
    expect(renderBold("plain text")).toEqual(["plain text"]);
  });

  it("returns a single empty string for an empty input", () => {
    expect(renderBold("")).toEqual([""]);
  });

  it("wraps a bold phrase in a <strong> element", () => {
    const parts = renderBold("hello **world** today");
    expect(parts).toHaveLength(3);
    expect(parts[0]).toBe("hello ");
    expect(React.isValidElement(parts[1])).toBe(true);
    const el = parts[1] as React.ReactElement;
    expect(el.type).toBe("strong");
    expect(el.props.children).toBe("world");
    expect(parts[2]).toBe(" today");
  });

  it("handles a marker at the start of the string", () => {
    const parts = renderBold("**bold** suffix");
    expect(parts).toHaveLength(3);
    expect(parts[0]).toBe("");
    const el = parts[1] as React.ReactElement;
    expect(el.type).toBe("strong");
    expect(el.props.children).toBe("bold");
    expect(parts[2]).toBe(" suffix");
  });

  it("handles a marker at the end of the string", () => {
    const parts = renderBold("prefix **bold**");
    expect(parts).toHaveLength(3);
    expect(parts[0]).toBe("prefix ");
    expect((parts[1] as React.ReactElement).props.children).toBe("bold");
    expect(parts[2]).toBe("");
  });

  it("handles multiple bold phrases", () => {
    const parts = renderBold("**a** and **b**");
    expect(parts).toHaveLength(5);
    expect(parts[0]).toBe("");
    expect((parts[1] as React.ReactElement).props.children).toBe("a");
    expect(parts[2]).toBe(" and ");
    expect((parts[3] as React.ReactElement).props.children).toBe("b");
    expect(parts[4]).toBe("");
  });

  it("assigns a stable key to each element", () => {
    const parts = renderBold("foo **bar** baz");
    const el = parts[1] as React.ReactElement;
    expect(el.key).toBe("1");
  });
});
