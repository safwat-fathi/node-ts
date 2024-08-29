// import { UploadModel } from "@/models/uploads/uploads.model";
// import { Upload, UploadDoc } from "@/types/db";

// export class UploadService {
//   async add(file: Express.Multer.File): Promise<UploadDoc | null> {
//     try {
//       if (!file) {
//         return null;
//       }

//       const newFile: Upload = {
//         name: file.filename,
//         url: `files/${file.filename}`,
//       };

//       const createdFile = await new UploadModel(newFile);

//       await createdFile.save();

//       return createdFile.toJSON();
//     } catch (err) {
//       throw new Error(`UploadService::find::${err}`);
//     }
//   }
// }
