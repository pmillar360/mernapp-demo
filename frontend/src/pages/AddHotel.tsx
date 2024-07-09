import { useMutation } from "react-query";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";

const AddHotel = () => {
    const {showToast} = useAppContext();
    const { mutate, isLoading } = useMutation(apiClient.addMyHotel, {
        onSuccess: () => {
            showToast({message: "Hotel added successfully", type: "success"});
        },
        onError: () => {
            showToast({message: "Error saving hotel", type: "error"});
        },
    });

    const handleSave = (hotelFormData: FormData) => {
        mutate(hotelFormData);
    }

    return (<ManageHotelForm onSave={handleSave} isLoading={isLoading} />)
}

export default AddHotel;