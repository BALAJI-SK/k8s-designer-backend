const userService = require("../../src/services/user.service");
const userController = require("../../src/controllers/user.controller");
const httpError = require("../../src/exceptions/user.exception");

describe("User Controller", () => {
  describe("generateOTP", () => {
    it("should generate otp", async () => {
      jest
        .spyOn(userService, "generateOtp")
        .mockResolvedValue({ message: "OTP sent to email" });

      jest.spyOn(userService, "saveOtp").mockResolvedValue(null);

      const mockReq = {
        body: {
          email: "demo@demo.com",
        },
      };

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await userController.generateOtp(mockReq, mockRes);

      expect(mockRes.status).toBeCalledWith(200);
      expect(mockRes.json).toBeCalledWith("OTP sent to email");
    });

    it("should return custom error message", async () => {
      jest
        .spyOn(userService, "generateOtp")
        .mockRejectedValue(new httpError("Custom Error", 400));

      const mockReq = {
        body: jest.fn(),
      };

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await userController.generateOtp(mockReq, mockRes);

      expect(mockRes.status).toBeCalledWith(400);
      expect(mockRes.json).toBeCalledWith({ message: "Custom Error" });
    });

    it("should return server error message", async () => {
      jest
        .spyOn(userService, "generateOtp")
        .mockRejectedValue(new Error("Internal Server Error"));

      const mockReq = {
        body: jest.fn(),
      };

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await userController.generateOtp(mockReq, mockRes);

      expect(mockRes.status).toBeCalledWith(500);
      expect(mockRes.json).toBeCalledWith({ message: "Internal Server Error" });
    });
  });

  describe("Create User", () => {
    it("should create new user", async () => {
      jest.spyOn(userService, "createUser").mockResolvedValue({
        message: { id: 1, name: "name", email: "email" },
      });
      const mockReq = {
        body: jest.fn(),
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await userController.createUser(mockReq, mockRes);
      expect(mockRes.status).toBeCalledWith(201);
      expect(mockRes.json).toBeCalledWith({
        message: { id: 1, name: "name", email: "email" },
      });
    });

    it("should return custom error message", async () => {
      jest
        .spyOn(userService, "createUser")
        .mockRejectedValue(new httpError("Custom Error", 400));
      const mockReq = {
        body: jest.fn(),
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await userController.createUser(mockReq, mockRes);
      expect(mockRes.status).toBeCalledWith(400);
      expect(mockRes.json).toBeCalledWith({ message: "Custom Error" });
    });

    it("should return server error message", async () => {
      jest
        .spyOn(userService, "createUser")
        .mockRejectedValue(new Error("Internal Server Error"));
      const mockReq = {
        body: jest.fn(),
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await userController.createUser(mockReq, mockRes);
      expect(mockRes.status).toBeCalledWith(500);
      expect(mockRes.json).toBeCalledWith({ message: "Internal Server Error" });
    });
  });

  describe("Login User", () => {
    it("should login user", async () => {
      jest
        .spyOn(userService, "loginUser")
        .mockResolvedValue({ token: "token" });
      const mockReq = {
        body: jest.fn(),
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await userController.loginUser(mockReq, mockRes);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockRes.json).toBeCalledWith({ token: { token: "token" } });
    });

    it("should return custom error message", async () => {
      jest
        .spyOn(userService, "loginUser")
        .mockRejectedValue(new httpError("Custom Error", 400));
      const mockReq = {
        body: jest.fn(),
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await userController.loginUser(mockReq, mockRes);
      expect(mockRes.status).toBeCalledWith(400);
      expect(mockRes.json).toBeCalledWith({ message: "Custom Error" });
    });

    it("should return server error message", async () => {
      jest
        .spyOn(userService, "loginUser")
        .mockRejectedValue(new Error("Internal Server Error"));
      const mockReq = {
        body: jest.fn(),
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await userController.loginUser(mockReq, mockRes);
      expect(mockRes.status).toBeCalledWith(500);
      expect(mockRes.json).toBeCalledWith({ message: "Internal Server Error" });
    });
  });

  describe("Validate User", () => {
    it("should validate user", async () => {
      jest.spyOn(userService, "validateUser").mockResolvedValue({
        message: { id: 1, name: "name", email: "email" },
      });
      const mockReq = {
        headers: {
          authorization: "Bearer Token",
        },
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await userController.validateUser(mockReq, mockRes);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockRes.json).toBeCalledWith({
        message: { id: 1, name: "name", email: "email" },
      });
    });

    it("should return custom error message", async () => {
      jest
        .spyOn(userService, "validateUser")
        .mockRejectedValue(new httpError("Custom Error", 400));
      const mockReq = {
        headers: {
          authorization: "Bearer Token",
        },
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await userController.validateUser(mockReq, mockRes);
      expect(mockRes.status).toBeCalledWith(400);
      expect(mockRes.json).toBeCalledWith({ message: "Custom Error" });
    });

    it("should return server error message", async () => {
      jest
        .spyOn(userService, "validateUser")
        .mockRejectedValue(new Error("Internal Server Error"));
      const mockReq = {
        headers: {
          authorization: "Bearer Token",
        },
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await userController.validateUser(mockReq, mockRes);
      expect(mockRes.status).toBeCalledWith(500);
      expect(mockRes.json).toBeCalledWith({ message: "Internal Server Error" });
    });
  });
});
