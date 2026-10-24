import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import axios from "axios";
import Grading from "./Grading";

jest.mock("axios");
jest.mock("lucide-react", () => new Proxy({ __esModule: true }, { get: (target, name) => (name in target ? target[name] : () => null) }));
global.IS_REACT_ACT_ENVIRONMENT = true;

const results = { courses: [{
  registrationId: "r1", courseId: "c1", code: "CS-101", name: "Programming", creditHours: 3,
  assessments: [{ type: "quiz", title: "Quiz 1", weightage: 5, obtainedMarks: 8, maxMarks: 10, stats: { average: 6.4, min: 2, max: 10 } }],
  totals: { gradedWeight: 5, ordinaryWeight: 100, percentageSoFar: 80, weightedMarks: 4, missingCount: 0 },
  sectionStats: { maxWeightedMarks: 5, minWeightedMarks: 1 },
}] };

test("every figure carries its name, so on a phone each row can read as a small card instead of a cut-off table", async () => {
  axios.get.mockResolvedValue({ data: results });
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  // eslint-disable-next-line testing-library/no-unnecessary-act
  await act(async () => { root.render(<Grading />); });
  await act(async () => { await new Promise((r) => setTimeout(r, 20)); });
  const cells = [...container.querySelectorAll(".marks-table tbody tr:first-child td")].slice(1);
  expect(cells.map((c) => c.getAttribute("data-label"))).toEqual(["Weightage", "Your marks", "Total marks", "Class average", "Min marks", "Max marks"]);
  const totals = [...container.querySelectorAll(".grand-total-table tbody td")].map((c) => c.getAttribute("data-label"));
  expect(totals).toEqual(["Your total", "Percentage", "Class highest", "Class lowest"]);
  act(() => root.unmount());
  container.remove();
});
