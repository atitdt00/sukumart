    import jwt from "jsonwebtoken"

    const JWT_SECRET= process.env.JWT_SECRET;

    if(!JWT_SECRET){
        throw new Error("Jwt_Secret is not defined");
    }
    export function createToken(user){
        return jwt.sign(
            {
                userId: user._id.toString(),
                role: user.role,
                email: user.email,
            },  
            JWT_SECRET,
            {
                expiresIn: "7d",
            }
        )
    }

    export function verifyToken(token){
        return jwt.verify(token, JWT_SECRET);
    }