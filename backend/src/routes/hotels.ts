import express, { Request, Response } from 'express';
import Hotel from '../models/hotel';
import { BookingType, HotelSearchResponse } from '../shared/types';
import { param, validationResult } from 'express-validator';
import Stripe from 'stripe';
import verifyToken from '../middleware/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const router = express.Router();

router.get("/search", async (req: Request, res: Response) => {
    try {
        const query = constructSearchQuery(req.query);

        let sortOptions = {};
        switch (req.query.sortOption) {
            case "starRating":
                sortOptions = { starRating: -1 };
                break;
            case "pricePerNightAsc":
                sortOptions = { pricePerNight: 1 };
                break;
            case "pricePerNightDesc":
                sortOptions = { pricePerNight: -1 };
                break;
        }

        const pageSize = 5; // Number of hotels to return per page
        const pageNumber = parseInt(
            req.query.page ? req.query.page.toString() : "1"
        );
        const skip = (pageNumber - 1) * pageSize;

        const hotels = await Hotel.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(pageSize);

        const total = await Hotel.countDocuments(query);

        const response: HotelSearchResponse = {
            data: hotels,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total / pageSize),
            },
        };

        res.json(response);
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

router.get("/:id", [
    param("id").notEmpty().withMessage("Hotel ID is required"),
], async (req: Request, res: Response) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const id = req.params.id.toString();

    try {
        const hotel = await Hotel.findById(id);
        res.json(hotel);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });        
    }
});

router.post("/:hotelId/bookings/payment-intent", verifyToken, async (req: Request, res: Response) => {
    const { numberOfNights } = req.body;
    const hotelId = req.params.hotelId;
    const userId = req.userId as string;

    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
    }

    const totalCost = numberOfNights * hotel.pricePerNight; // Calculate the total cost of the booking based on the number of nights and the price per night on the backend to prevent tampering with the price on the frontend

    const paymentIntent = await stripe.paymentIntents.create({
        amount: totalCost  * 100,
        currency: "cad",
        metadata: {
            hotelId,
            userId,
        },
    });

    if (!paymentIntent.client_secret) {
        return res.status(500).json({ message: "Failed to create payment intent" });
    }

    const response = {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret.toString(),
        totalCost,
    };

    res.send(response);
});

router.post("/:hotelId/bookings", verifyToken, async (req: Request, res: Response) => {
    try {
        const paymentIntentId = req.body.paymentIntentId;

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId); // Retrieve the payment intent from Stripe to verify the payment

        if (!paymentIntent) {
            console.log("Payment intent not found");
            return res.status(404).json({ message: "Payment intent not found" });
        }

        if (paymentIntent.metadata.hotelId != req.params.hotelId || 
            paymentIntent.metadata.userId != req.userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        if (paymentIntent.status !== "succeeded") {
            return res.status(400).json({ message: `Payment failed: ${paymentIntent.status}` });
        }

        const newBooking: BookingType = {
            ...req.body, userId: req.userId,
        };

        const hotel = await Hotel.findOneAndUpdate({_id: req.params.hotelId}, {
            $push: { bookings: newBooking }, 
        });

        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        await hotel.save();

        res.status(200).send({ message: "Booking successful" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

/* 
    This function constructs a MongoDB query object based on the query parameters passed in the request.
    The query object is used to filter the hotels collection based on the search criteria.
*/
const constructSearchQuery = (queryParams: any) => {
    let constructedQuery: any = {};

    if (queryParams.destination) {
        constructedQuery.$or = [
            { city: new RegExp(queryParams.destination, "i") },
            { country: new RegExp(queryParams.destination, "i") },
        ];
    }

    if (queryParams.adultCount) {
        constructedQuery.adultCount = {
            $gte: parseInt(queryParams.adultCount),
        };
    }

    if (queryParams.childCount) {
        constructedQuery.childCount = {
            $gte: parseInt(queryParams.childCount),
        };
    }

    if (queryParams.facilities) {
        constructedQuery.facilities = {
            $all: Array.isArray(queryParams.facilities)
                ? queryParams.facilities
                : [queryParams.facilities],
        };
    }

    if (queryParams.types) {
        constructedQuery.type = {
            $in: Array.isArray(queryParams.types)
                ? queryParams.types
                : [queryParams.types],
        };
    }

    if (queryParams.stars) {
        const starRatings = Array.isArray(queryParams.stars)
            ? queryParams.stars.map((star: string) => parseInt(star))
            : parseInt(queryParams.stars);

        constructedQuery.starRating = { $in: starRatings };
    }

    if (queryParams.maxPrice) {
        constructedQuery.pricePerNight = {
            $lte: parseInt(queryParams.maxPrice).toString(),
        };
    }

    return constructedQuery;
};

export default router;