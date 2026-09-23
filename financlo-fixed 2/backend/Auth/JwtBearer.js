const jwt = require('jsonwebtoken');

class JwtBearerMiddleware {
    constructor(secretKey) {
        this.secretKey = secretKey;
        // Bind so `this` still works when Express calls it as a plain function
        this.authenticate = this.authenticate.bind(this);
    }

    authenticate(req, res, next) {
        const authHeader = req.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization header is missing or malformed' });
        }

        const token = authHeader.split(' ')[1];

        jwt.verify(token, this.secretKey, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Token is invalid or expired' });
            }

            // Attach the decoded payload so route handlers can read req.user
            req.user = decoded;

            // BUG FIXED: the old code called next() and then ALSO res.json(...),
            // which sends two responses and crashes with
            // "Cannot set headers after they are sent to the client".
            next();
        });
    }
}

module.exports = JwtBearerMiddleware;
