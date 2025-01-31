import { FormEvent, useState } from "react";
import { useSearchContext } from "../contexts/SearchContext"
import { MdTravelExplore } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

const SearchBar = () => {
    const search = useSearchContext();
    const navigate = useNavigate();
    const {showToast} = useAppContext();

    const [destination, setDestination] = useState<string>(search.destination);
    const [checkIn, setCheckIn] = useState<Date>(search.checkIn);
    const [checkOut, setCheckOut] = useState<Date>(search.checkOut);
    const [adultCount, setAdultCount] = useState<number>(search.adultCount);
    const [childCount, setChildCount] = useState<number>(search.childCount);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (checkIn && checkOut && checkIn >= checkOut) {
            showToast({message: "Check-out date must be after check-in date", type: "error"});
            return;
        }

        search.saveSearchValues(destination, checkIn, checkOut, adultCount, childCount);

        navigate("/search")
    };

    const handleReset = () => {
        setDestination("");
        setCheckIn(new Date());
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setCheckOut(tomorrow);
        setAdultCount(1);
        setChildCount(0);
    };

    const minDate = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1); // Set max date to 1 year from now

    return (
        <form onSubmit={handleSubmit} className="-mt-8 p-3 bg-orange-400 rounded shadow-md grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 items-center gap-4" onReset={handleReset}>
            <div className="flex flex-row items-center flex-1 bg-white p-2">
                <MdTravelExplore size={25} className="mr-2" />
                <input type="text" placeholder="Destination" value={destination} className="text-md w-full focus:outline-none" onChange={(event) => setDestination(event.target.value)}/>
            </div>

            <div className="flex bg-white px-2 py-1 gap-2">
                <label className="items-center flex">
                    Adults:
                    <input type="number" min={1} max={20} value={adultCount} onChange={(event) => setAdultCount(parseInt(event.target.value))} className="w-full p-1 focus:outline-none" />
                </label>
                <label className="items-center flex">
                    Children:
                    <input type="number" min={0} max={20} value={childCount} onChange={(event) => setChildCount(parseInt(event.target.value))} className="w-full p-1 focus:outline-none" />
                </label>
            </div>
            <div>
                <DatePicker selected={checkIn} onChange={(date) => setCheckIn(date as Date)} selectsStart startDate={checkIn} endDate={checkOut} minDate={minDate} maxDate={maxDate} placeholderText="Check-in Date" className="min-w-full bg-white p-2 focus:outline-none" wrapperClassName="min-w-full"/>
            </div>
            <div>
                <DatePicker selected={checkOut} onChange={(date) => setCheckOut(date as Date)} selectsEnd startDate={checkIn} endDate={checkOut} minDate={minDate} maxDate={maxDate} placeholderText="Check-out Date" className="min-w-full bg-white p-2 focus:outline-none" wrapperClassName="min-w-full"/>
            </div>
            <div>
                <button className="w-2/3 bg-blue-600 text-white h-full p-2 font-bold text-xl hover:bg-blue-500">Search</button>
                <button className="w-1/3 bg-red-600 text-white h-full p-2 font-bold text-xl hover:bg-red-500" type="reset">Clear</button>
            </div>
        </form>
    );
};

export default SearchBar;