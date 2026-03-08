import jwt from "jsonwebtoken";

// Like authMiddleware but does NOT reject — just attaches user if token exists
const optionalAuth = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        req.user = null;
        return next();
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch {
        req.user = null;
    }
    next();
};

export default optionalAuth;
