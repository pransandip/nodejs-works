import { Request } from 'express';
import multer from 'multer';
import path from 'path';

const filestorageEngine = multer.diskStorage({
  destination: path.join(__dirname, '../public/upload'),
  filename: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: filestorageEngine });

export default upload;
