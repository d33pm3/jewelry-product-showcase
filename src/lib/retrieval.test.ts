import { describe, expect, test } from "bun:test";
import { answerQuestion, DEMO_BANNER, type Turn } from "./retrieval";

describe("deterministic catalogue retrieval", () => {
  test("answers an exact product question from local catalogue data", () => {
    const result = answerQuestion("What is the price of R101?", []);

    expect(result.text).toContain("Classic Diamond Ring");
    expect(result.text).toContain("135000");
    expect(result.sources).toEqual(["R101"]);
  });

  test("filters available diamond items without an external service", () => {
    const result = answerQuestion("List all available diamond items.", []);

    expect(result.sources).toEqual(["R101", "E302", "P501"]);
    expect(result.text).toContain("Here is what the catalogue has (3)");
  });

  test("uses prior focus for a follow-up question", () => {
    const history: Turn[] = [
      {
        role: "assistant",
        text: "Classic Diamond Ring",
        focus: ["R101"],
        sources: ["R101"],
      },
    ];

    const result = answerQuestion("What is its weight?", history);

    expect(result.text).toContain("5.2 g");
    expect(result.sources).toEqual(["R101"]);
  });

  test("refuses unsupported discount requests and remains explicitly offline", () => {
    const result = answerQuestion("Can I get a discount?", []);

    expect(result.sources).toEqual([]);
    expect(result.text).toContain("not in the Ornativa catalogue");
    expect(DEMO_BANNER).toContain("Not connected to an AI API");
  });
});
