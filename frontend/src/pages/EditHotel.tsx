import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../api-client"
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import { useAppContext } from "../contexts/AppContext";

const EditHotel = () => {
    const { hotelId } = useParams();
    const { showToast } = useAppContext();

    const { data: hotel} = useQuery("fetchMyHotelById", () => apiClient.fetchMyHotelById(hotelId || ''), {
        enabled: !!hotelId, // Only fetch the hotel if the hotelId is available
    });

    const { mutate, isLoading } = useMutation(apiClient.updateMyHotelById, {
        onSuccess: () => {
            console.log("Hotel updated successfully");
            showToast({message: "Hotel updated successfully", type: "success"})
        },
        onError: (error: Error) => {
            console.error("Error updating hotel: ", error);
            showToast({message: "Error updating hotel", type: "error"})
        }
    });

    const handleSave = (hotelFormData: FormData) => {
        mutate(hotelFormData);
    };

    return <ManageHotelForm hotel={hotel} onSave={handleSave} isLoading={isLoading}/>
};

export default EditHotel;