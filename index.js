const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const Root = require("./routers/Root.js");



// middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://learnio-psi.vercel.app",
    ],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// multer stuff
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(12, function (err, bytes) {
      const fn =
        bytes.toString("hex") +
        path.extname(file.originalname);
      cb(null, fn);
    });
  },
});

const upload = multer({ storage: storage });


// Routers
app.use("/", Root);

app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ message: "No file uploaded" });
  }
  res.json({
    message: "File uploaded successfully",
    filename: req.file.filename,
    filePath: `/images/${req.file.filename}`,
  });
});

app.listen(port, () => {
  console.log(`server is running on port : ${port}`);
});
