// // middleware/userCode.ts
// import { Request, Response, NextFunction } from "express";
// import { v4 as uuidv4 } from "uuid";
export {};
// declare global {
//   namespace Express {
//     interface Request {
//       userCode?: string;
//     }
//   }
// }
// export function assignUserCode(req: Request, res: Response, next: NextFunction) {
//   let userCode = req.cookies?.userCode;
//   if (!userCode) {
//     userCode = uuidv4();
//     res.cookie("userCode", userCode, {
//       httpOnly: true,
//       maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
//       sameSite: "lax",
//       // secure: true, // uncomment once you're on HTTPS in production
//     });
//   }
//   req.userCode = userCode;
//   next();
// }
//# sourceMappingURL=userCode.js.map