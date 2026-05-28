import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|webp|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb({ message: 'Images only!' });
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

// Single or multiple file routing setup (Cloudinary swap point later)
router.post('/', upload.array('images', 5), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send({ message: 'No images uploaded' });
    }

    // Map all uploaded local paths correctly for the frontend
    const imagePaths = req.files.map((file) => `/${file.path.replace(/\\/g, '/')}`);

    res.status(200).send({
        message: 'Images Uploaded',
        images: imagePaths,
    });
});

export default router;
