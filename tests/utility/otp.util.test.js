const { transporter, sendOtp } = require("../../src/utility/otp.util");

describe("sendOtp", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("sends an email with the OTP and returns the OTP", async () => {
    const email = "test@example.com";

    const mockSendMail = jest.spyOn(transporter, "sendMail");

    mockSendMail.mockImplementationOnce((mailOptions, callback) => {
      callback(null, { response: "250 Message sent" });
    });

    const OTP = await sendOtp(email);

    expect(mockSendMail).toHaveBeenCalled();
    expect(mockSendMail.mock.calls[0][0].to).toBe(email);
    expect(OTP).toBeTruthy();
  });

  it("throws an error if the email fails to send", async () => {
    const email = "demo@demo.com";

    const mockSendMail = jest.spyOn(transporter, "sendMail");

    mockSendMail.mockImplementationOnce((mailOptions, callback) => {
      callback(new Error("some error"), null);
    });

    await expect(sendOtp(email)).rejects.toThrow("some problem with the email");

    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: "OTP for registration (K8S Designer)",
      }),
      expect.any(Function)
    );
  });
});
