import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestsSection from "./GuestsSection";
import ImagesSection from "./ImagesSection";
import { HotelType } from "../../../../backend/src/shared/types";
import { useEffect } from "react";

export type HotelFormData = {
    name: string;
    city: string;
    country: string;
    description: string;
    type: string;
    pricePerNight: number;
    starRating: number;
    facilities: string[];
    imageFiles: FileList;
    imageUrls: string[];
    adultCount: number;
    childCount: number;
}

type Props = {
    onSave: (hotelFormData: FormData) => void;
    isLoading: boolean;
    hotel?: HotelType;
}

const ManageHotelForm = ({onSave, isLoading, hotel}: Props) => {
    const formMethods = useForm<HotelFormData>();
    const { handleSubmit, reset } = formMethods;

    useEffect(() => { // Reset the form when the hotel changes
        reset(hotel);
    }, [hotel, reset]);

    const onSubmit = handleSubmit((data: HotelFormData) => {
        // console.log(data);
        // Create a new FormData object for the API
        const formData = new FormData();

        if (hotel) {
            formData.append("hotelId", hotel._id); // Add the hotelId if it exists (for updating)             
        }

        formData.append("name", data.name);
        formData.append("city", data.city);
        formData.append("country", data.country);
        formData.append("description", data.description);
        formData.append("type", data.type);
        formData.append("pricePerNight", data.pricePerNight.toString());
        formData.append("starRating", data.starRating.toString());
        formData.append("adultCount", data.adultCount.toString());
        formData.append("childCount", data.childCount.toString());

        // formData.append("facilities", JSON.stringify(data.facilities)); // Maybe this works instead of the following code?

        data.facilities.forEach((facility, index) => {
            formData.append(`facilities[${index}]`, facility)
        });

        if (data.imageUrls) {
            data.imageUrls.forEach((url, index) => {
                formData.append(`imageUrls[${index}]`, url);
            });            
        }

        Array.from(data.imageFiles).forEach((file) => {
            formData.append("imageFiles", file);
        });

        onSave(formData);
    });

    return (
    <FormProvider {...formMethods}>
        <form className="flex flex-col gap-10" onSubmit={onSubmit}>
            <DetailsSection />
            <TypeSection />
            <FacilitiesSection />
            <GuestsSection />
            <ImagesSection />
            <span className="flex justify-end">
                <button type="submit" disabled={isLoading} className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl disabled:bg-gray-500">
                    {isLoading ? "Saving..." : "Save"}
                </button> 
            </span>
        </form>
    </FormProvider>); 
};

export default ManageHotelForm;