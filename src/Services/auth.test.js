import { requestPasswordReset, verifyResetCode, resetPassword } from "./auth";
import api from "./api";

jest.mock("./api", () => ({ __esModule: true, default: { post: jest.fn() } }));
const noAnswer = { request: {}, message: "Network Error", code: "ERR_NETWORK" };

test("forgot-password steps say 'couldn't reach the server' on a lost connection, not the raw 'Network Error'", async () => {
  api.post.mockRejectedValue(noAnswer);
  const expected = "Couldn't reach the server. Check your internet connection and try again.";
  await expect(requestPasswordReset("a@b.c")).rejects.toThrow(expected);
  await expect(verifyResetCode("a@b.c", "123456")).rejects.toThrow(expected);
  await expect(resetPassword("a@b.c", "123456", "new-pass-1")).rejects.toThrow(expected);
});

test("the server's own reason is passed on, and the step's own sentence is the last resort", async () => {
  api.post.mockRejectedValueOnce({ response: { status: 400, data: { message: "That code has expired" } } });
  await expect(verifyResetCode("a@b.c", "1")).rejects.toThrow("That code has expired");
  api.post.mockRejectedValueOnce({ response: { status: 500, data: {} } });
  await expect(requestPasswordReset("a@b.c")).rejects.toThrow("Failed to request password reset");
});
