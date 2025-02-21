# File Upload with Multer in Express.js

This project sets up an Express.js server with Multer for handling file uploads. It supports storing uploaded images in the `public/images` directory and serves them statically.

## Installation

1. Clone the repository:
   ```sh
   git clone <clone-repo-url>
   ```
2. Install dependencies:
   ```sh
   npm install express multer cors crypto path
   ```
3. Start the server:
   ```sh
   node index.js
   ```
   or (if using nodemon):
   ```sh
   npm run dev
   ```

## Middleware Configuration

### CORS Setup
```javascript
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
```
- Enables **CORS** to allow cross-origin requests from specific front-end applications.

## Multer File Upload Configuration

```javascript
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(12, function (err, bytes) {
      const fn = bytes.toString("hex") + path.extname(file.originalname);
      cb(null, fn);
    });
  },
});

const upload = multer({ storage: storage });
```

### How it Works:
- **Multer Storage (`multer.diskStorage`)** → Defines where and how files are saved.
- **Destination Function** → Saves uploaded files in the `./public/images` directory.
- **Filename Function**:
  - Generates a random filename using `crypto.randomBytes(12)`.
  - Appends the original file extension using `path.extname(file.originalname)`.
  - Example: If the uploaded file is `profile.png`, it could be saved as `a3f5e8d0c7b6.png`.

## File Upload API Endpoint

```javascript
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({
    message: "File uploaded successfully",
    filename: req.file.filename,
    filePath: `/images/${req.file.filename}`,
  });
});
```

### How it Works:
- **POST `/upload`**:
  - Accepts a file upload with the key **"image"**.
  - If no file is uploaded → Returns **400 Bad Request** with `{ message: "No file uploaded" }`.
  - If successful, returns a JSON response:

```json
{
  "message": "File uploaded successfully",
  "filename": "randomfilename.png",
  "filePath": "/images/randomfilename.png"
}
```

## Testing the API with Postman
1. **Start the server**
   ```sh
   npm run dev
   ```
2. **Open Postman**
3. **Select `POST` request**
4. **Enter URL:** `http://localhost:5000/upload`
5. **Go to "Body" Tab → Select "form-data"**
6. **Add a Key-Value Pair:**
   - Key: `image` (set it to `File`)
   - Value: Select an image file from your computer.
7. **Click "Send"**
8. **Expected Response:**
   ```json
   {
     "message": "File uploaded successfully",
     "filename": "a3f5e8d0c7b6.png",
     "filePath": "/images/a3f5e8d0c7b6.png"
   }
   ```

## Serving Uploaded Files
To serve uploaded images in the browser, add this to your Express app:

```javascript
app.use("/images", express.static("public/images"));
```

Now, you can access uploaded images like:
```
http://localhost:5000/images/a3f5e8d0c7b6.png
```

## Summary
✔ **Express.js server** running on port **5000**  
✔ **CORS enabled** for local & deployed frontend  
✔ **File uploads handled with Multer**  
✔ **Uploaded files stored in `public/images/`**  
✔ **POST `/upload` route to handle image uploads**  
✔ **Test with Postman or frontend**  

## License
This project is open-source and free to use.

