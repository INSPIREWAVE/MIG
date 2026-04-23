import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateToken } from '../middleware/auth.middleware';
import * as ctrl from '../controllers/documents.controller';

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = path.join(UPLOAD_DIR, 'docs');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(pdf|png|jpg|jpeg|gif|doc|docx|xlsx|csv)$/i;
    if (allowed.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'));
    }
  },
});

const router = Router();

router.use(authenticateToken);

router.get('/client/:clientId', ctrl.listClientDocuments);
router.post('/client', upload.single('file'), ctrl.uploadClientDocument);
router.post('/client/:clientId', upload.single('file'), ctrl.uploadClientDocument);
router.delete('/client/:id', ctrl.deleteClientDocument);
router.get('/company', ctrl.listCompanyDocuments);
router.post('/company', upload.single('file'), ctrl.uploadCompanyDocument);
router.delete('/company/:id', ctrl.deleteCompanyDocument);
router.get('/download/:type/:id', ctrl.downloadDocument);

export default router;
