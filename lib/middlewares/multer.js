// https://github.com/expressjs/multer
import multer from 'multer';
import DDError from '../helpers/dderror';

const upload = multer({
  storage: multer.memoryStorage(),
});

// 现在只接受一个一个上传
// file为接受的上传文件的字段
export default function (req, res, next) {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return next(new DDError(err.message, 400, err));
    }
    return next();
  });
}
