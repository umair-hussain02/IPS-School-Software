import "express";
import { ITeacher } from "../modules/users/teacher/teacher.model";
import { IStudent } from "../modules/users/student/student.model";
import { IAdmin } from "../modules/users/admin/admin.model";

declare module "express-serve-static-core" {
  interface Request {
    user?: ITeacher | IStudent | IAdmin;
  }
}
