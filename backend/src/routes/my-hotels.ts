import express, { Request, Response} from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
import Hotel, { HotelType } from '../models/hotel';
import verifyToken from '../middleware/auth';
import { body } from 'express-validator';

const router = express.Router();

const storage = multer.memoryStorage(); // Store the files from the post requests in memory
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    }
})

// api/my-hotels
router.post(
    "/",
    verifyToken, // Ensure only authenticated users can create hotels
    [
        body("name").notEmpty().withMessage("Name is required"),
        body("city").notEmpty().withMessage("City is required"),
        body("country").notEmpty().withMessage("Country is required"),
        body("description").notEmpty().withMessage("Description is required"),
        body("type").notEmpty().withMessage("Hotel type is required"),
        body("pricePerNight").notEmpty().withMessage("Price per night is required").isNumeric().withMessage("Price per night must be a number"),
        body("facilities").notEmpty().isArray().withMessage("Facilities must be an array"),
    ],
    upload.array("imageFiles", 6),
    async (req: Request, res: Response) => {
        try {
            const imageFiles  = req.files as Express.Multer.File[]; // Get the files from the request
            const newHotel: HotelType = req.body;

            // Upload the images to the cloud storage
            const uploadPromises = imageFiles.map(async (image) => {
                const b64 = Buffer.from(image.buffer).toString("base64"); // Convert the image buffer to base64
                let dataURI = `data:${image.mimetype};base64,${b64}`; // Create a data URI
                const res = await cloudinary.v2.uploader.upload(dataURI); // Upload the image to cloudinary

                return res.url;
            })

            // If upload is successful, add the image URLs to the Hotel object
            const imageUrls = await Promise.all(uploadPromises);
            newHotel.imageUrls = imageUrls;
            newHotel.lastUpdated = new Date();
            newHotel.userId = req.userId as string; // cast to string or accept null in HotelType?

            // Save the Hotel object to the database
            const hotel = new Hotel(newHotel);
            await hotel.save();
            
            // Send a 201 response with the Hotel object
            res.status(201).send(hotel);
        } catch (error) {
            console.log("Error creating hotel: ", error);
            res.status(500).json({ message: "Something went wrong."});
        }
});

export default router;