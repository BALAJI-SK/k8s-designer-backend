const { transporter, sendOtp } = require("../../src/utility/otp.util");

describe("sendOtp", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("sends an email with the OTP and returns the OTP", async () => {
    const email = "test@example.com";

    const mockSendMail = jest.spyOn(transporter, "sendMail");

    mockSendMail.mockReturnValueOnce({});

    await sendOtp(email);

    expect(mockSendMail).toHaveBeenCalled();
    expect(mockSendMail.mock.calls[0][0].to).toBe(email);
  });

  it("throws an error if the email fails to send", async () => {});
});
