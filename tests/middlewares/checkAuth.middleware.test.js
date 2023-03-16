const jwt = require("jsonwebtoken");
const http2constants = require("http2").constants;
require('dotenv').config();
const checkAuth = require("../../src/middlewares/checkAuth.middleware");

describe("checkAuth middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {
        authorization:
          "Bearer " +
          jwt.sign({ userId: "123" }, process.env.JWT_SECRET, {
            expiresIn: "1h",
          }),
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should set req.userData if valid token is provided", () => {
    checkAuth(req, res, next);
    expect(req.userData.userId).toBe("123");
    expect(next).toHaveBeenCalled();
  });

  it("should return 401 if no token is provided", () => {
    req.headers.authorization = undefined;
    checkAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(
      http2constants.HTTP_STATUS_UNAUTHORIZED
    );
    expect(res.json).toHaveBeenCalledWith({ message: "Auth failed" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if token is invalid", () => {
    req.headers.authorization = "Bearer invalidtoken";
    checkAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(
      http2constants.HTTP_STATUS_UNAUTHORIZED
    );
    expect(res.json).toHaveBeenCalledWith({ message: "Auth failed" });
    expect(next).not.toHaveBeenCalled();
  });
});
