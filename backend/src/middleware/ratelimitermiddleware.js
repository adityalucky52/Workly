import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200, // limit each IP to 200 requests per minute (increased for development)
  message: "Too many requests from this IP, please try again after a minute",
  // Skip rate limiting in development for better DX
  skip: (req) => process.env.NODE_ENV === "development",
});

export default limiter;
