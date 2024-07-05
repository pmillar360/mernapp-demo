import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";

const SignOutButton = () => {
    const queryClient = useQueryClient();
    const { showToast } = useAppContext();
    const mutation = useMutation(apiClient.signOut, {
        onSuccess: async () => {
            await queryClient.invalidateQueries("validateToken");
            showToast({message:"Signed out successfully", type:"success"});
        },
        onError: (error: Error) => {
            showToast({message: error.message, type: "error"});
        }
    });

    const handleClick = () => {
        mutation.mutate();
    }

    return (
        <button className="text-blue-600 bg-white px-3 font-bold hover:bg-gray-100" onClick={handleClick}>
            Sign Out
        </button>
    )
}

export default SignOutButton;