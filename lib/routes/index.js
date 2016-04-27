import express from 'express';
const router = express.Router();

import { upload, exifInfo } from '../controllers/uploadController';
import multer from '../middlewares/multer';
import imageInitializer from '../middlewares/imageInitializer';

router.all('/', (req, res) => res.json('hello, images service here!'));

// multipart/form-data图片上传
router.post('/images', multer, imageInitializer, upload);

router.get('/images/exif', exifInfo);

export default router;
