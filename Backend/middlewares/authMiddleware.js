import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    if (!user.isActive) {
      res.clearCookie("token"); // proactively clear their stale cookie too
      return res.status(403).json({
        message:
          "Your account has been deactivated. Please contact your admin.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};
