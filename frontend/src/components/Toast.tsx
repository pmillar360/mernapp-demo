import { useEffect } from "react";

type ToastProps = {
    message: string;
    type: "success" | "error";
    onClose: () => void;
};

const Toast = ({message, type, onClose}: ToastProps) => {

    const styles = type === "success"
        ? "fixed top-4 right-4 z-50 p-4 rounded-md bg-green-600 text-white max-w-md"
        : "fixed top-4 right-4 z-50 p-4 rounded-md bg-red-600 text-white max-w-md"

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        return () => {
            clearTimeout(timer);
        }
    }, [onClose]); // Run this effect only when onClose changes

    return (
        <div className={styles}>
            <div className="flex justify-center items-center">
                <span className="text-lg font-semibold">
                    {message}
                </span>
            </div>
        </div>
    )
}

export default Toast;