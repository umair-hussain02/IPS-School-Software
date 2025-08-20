import { Request } from "express";
import { File } from "multer";

export interface TeacherFiles {
  profilePicture?: File[];
  resume?: File[];
  otherDocuments?: File[];
  [fieldname: string]: File[] | undefined; // ✅ allow any string key (fixes TS error)
}

export interface TeacherRequest extends Request {
  files?: TeacherFiles;
}
