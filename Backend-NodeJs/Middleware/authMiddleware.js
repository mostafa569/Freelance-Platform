const jwt = require("jsonwebtoken");

exports.auth = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Please Login First",
            status: "fail"
        });
    }

    try {
        const token = authorization.split(" ")[1];
        const data = jwt.verify(token, process.env.SECRET_KEY);
        req.userId = data.userId;
        req.email = data.email;
        req.role = data.role;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Please Login First",
            status: "fail"
        });
    }
};
