import express from 'express';
import fs from 'fs';
import dotenv from 'dotenv';
import multer from 'multer';
import S3 from 'aws-sdk/clients/s3.js';
import { triggerAsyncId } from 'async_hooks';
import path from 'path';
import util from 'util';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

dotenv.config();
const router = express.Router();
const unlinkFile = util.promisify(fs.unlink);

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_BUCKET_REGION,
});

// uploads a file to s3
const uploadFileToS3 = (file) => {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Body: fileStream,
    Key: file.filename,
  };
  return s3.upload(uploadParams).promise();
};

// Checks that uploaded images are either: .jpg/.jpeg/.png
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
}

const upload = multer({
  dest: 'uploads/',
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// @description Upload an Image to AWS S3
// @route POST /api/upload
// @access Private/Admin
/**
 * @api {post} /api/upload
 * @apiGroup Upload
 * @apiPermission Private/Admin
 *
 * @apiDescription This route uploads images to AWS S3 to be displayed on the website
 *
 * @apiParam {Object} FormData FormData with the selected image appended
 *
 * @apiSuccess {Object} imagePath providing a imagePath to access the image uploaded to S3
 */
router.post('/', protect, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const result = await uploadFileToS3(req.file);

    // Deletes the file from the server after it has been uploaded to S3
    await unlinkFile(req.file.path);

    // Returns a public image URL for the successfully uploaded image
    res.send({ imagePath: result.Location });
  } catch (error) {
    res.status(400).json(error);
  }
});

export default router;
