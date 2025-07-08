import multer from "multer";  // nodejs middleware for handling multipart/form-data and storing files

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp/')
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
  })

const upload = multer({ storage: storage })

export {upload};