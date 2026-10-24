import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import Sidebar from "./Sidebar";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({ useNavigate: () => mockNavigate }), { virtual: true });
global.IS_REACT_ACT_ENVIRONMENT = true;

test("every menu item goes somewhere: there is no Settings item that does nothing", async () => {
  sessionStorage.setItem("user", JSON.stringify({ name: "Ayesha Khan" }));
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  const onNavClick = jest.fn();
  // eslint-disable-next-line testing-library/no-unnecessary-act
  await act(async () => { root.render(<Sidebar isOpen activePage="dashboard" onNavClick={onNavClick} />); });
  const labels = [...container.querySelectorAll(".sidebar-nav-item")].map((a) => a.textContent.replace(/[^A-Za-z]/g, ""));
  expect(labels).toEqual(["Dashboard", "Attendance", "Marks", "Transcript", "Timetable"]);
  for (const link of container.querySelectorAll(".sidebar-nav-item")) {
    mockNavigate.mockClear();
    await act(async () => { link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true })); });
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  }
  act(() => root.unmount());
  container.remove();
  sessionStorage.clear();
});
