import { RegisterFormData } from './pages/Register';
import { SignInFormData } from './pages/LogIn';
import { HotelSearchResponse, HotelType, PaymentIntentResponse, UserType } from '../../backend/src/shared/types';
import { BookingFormData } from './forms/BookingForm/BookingForm';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// export const fetchCurrentUser = async (): Promise<UserType> => {
//     const response = await fetch(`${API_BASE_URL}/api/users/me`, {
//         credentials: "include",
//     })

//     console.log(response.json());

//     if (!response.ok) {
//         throw new Error("Error fetching user");
//     }

//     return response.json();
// };

export const fetchCurrentUser = async (): Promise<UserType> => {
    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Error fetching user");
    }
    return response.json();
  };

export const register = async (formData: RegisterFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: "POST",
        credentials: "include", // Send cookies along with the request
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    const responseBody = await response.json();

    if (!response.ok) {
        throw new Error(responseBody.message);
    }
};

export const logIn = async (formData: SignInFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })

    const body = await response.json();

    if (!response.ok) {
        throw new Error(body.message);
    }

    return body;
};

export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Invalid token");
  }

  return response.json();
};

export const signOut = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Sign out failed");
    }
};

export const addMyHotel = async (hotelFormData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
        method: "POST",
        credentials: "include",
        body: hotelFormData,
    });

    if (!response.ok) {
        throw new Error("Error saving hotel");
    }

    return response.json();
};

export const fetchMyHotels = async (): Promise<HotelType[]> => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Error fetching hotels");
    }

    return response.json();
};

export const fetchMyHotelById = async (hotelId: string): Promise<HotelType> => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Error fetching hotel");
    }

    return response.json();
};

export const updateMyHotelById = async (hotelFormData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelFormData.get("hotelId")}`, {
        method: "PUT",
        credentials: "include",
        body: hotelFormData,
    });

    if (!response.ok) {
        throw new Error("Error updating hotel");
    }

    return response.json();
};

export type SearchParams = {
    destination?: string;
    checkIn?: string;
    checkOut?: string;
    adultCount?: string;
    childCount?: string;
    page?: string;
    facilities?: string[];
    types?: string[];
    stars?: string[];
    maxPrice?: string;
    sortOption?: string;
};

export const searchHotels = async (searchParams: SearchParams): Promise<HotelSearchResponse> => {
    const queryParams = new URLSearchParams();

    queryParams.append("destination", searchParams.destination || "");
    queryParams.append("checkIn", searchParams.checkIn || "");
    queryParams.append("checkOut", searchParams.checkOut || "");
    queryParams.append("adultCount", searchParams.adultCount || "");
    queryParams.append("childCount", searchParams.childCount || "");
    queryParams.append("page", searchParams.page || "");

    queryParams.append("sortOption", searchParams.sortOption || "");
    queryParams.append("maxPrice", searchParams.maxPrice || "");

    searchParams.facilities?.forEach((facility) => {
        queryParams.append("facilities", facility)
    });

    searchParams.types?.forEach((type) => {
        queryParams.append("types", type)
    });

    searchParams.stars?.forEach((star) => {
        queryParams.append("stars", star)
    });

    const response = await fetch(`${API_BASE_URL}/api/hotels/search?${queryParams}`);

    if (!response.ok) {
        throw new Error("Error searching hotels");
    }

    return response.json();
};

export const fetchHotels = async (): Promise<HotelType[]> => {
    const response = await fetch(`${API_BASE_URL}/api/hotels`);

    if (!response.ok) {
        throw new Error("Error fetching hotels");
    }

    return response.json();
};

export const fetchHotelById = async (hotelId: string): Promise<HotelType> => {
    const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`);

    if (!response.ok) {
        throw new Error("Error fetching hotel");
    }

    return response.json();
};

export const createPaymentIntent = async (hotelId: string, numberOfNights: string): Promise<PaymentIntentResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}/bookings/payment-intent`, {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({ numberOfNights }),
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Error creating payment intent");
    }

    return response.json();
};

export const createBooking = async (formData: BookingFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/hotels/${formData.hotelId}/bookings`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    if (!response.ok) {
        throw new Error("Error creating booking");
    }
};

export const fetchMyBookings = async (): Promise<HotelType[]> => {
    const response = await fetch(`${API_BASE_URL}/api/my-bookings`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Error fetching bookings");
    }

    return response.json();
}