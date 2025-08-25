const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // La carpeta donde se guardarán las imágenes
    },
    filename: function (req, file, cb) {
        // Guarda el archivo con su nombre original
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;