import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const headerToken = req.headers["authorization"];
  if (headerToken && headerToken.startsWith("Bearer ")) {
    const bearerToken = headerToken.split(" ");

    try {
      const validToken = jwt.verify(
        bearerToken[1],
        process.env.SECRET_KEY || "rN4Z3yn96rJLv!zzB(+q"
      );
      next();
    } catch (err) {
        res.status(400).json({
            error: 'invalid token'
        })
    }
  } else {
    res.status(400).json({
      error: "Acceso denegado",
    });
  }
};

export default validateToken;
