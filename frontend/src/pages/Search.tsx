import { useQuery } from "react-query";
import { useSearchContext } from "../contexts/SearchContext";
import * as apiClient from "../api-client";
import React, { useState } from "react";
import SearchResultsCard from "../components/SearchResultsCard";
import Pagination from "../components/Pagination";
import StarRatingFilter from "../components/SearchFilters/StarRatingFilter";
import HotelTypesFilter from "../components/SearchFilters/HotelTypesFilter";
import FacilitiesFilter from "../components/SearchFilters/FacilitiesFilter";
import PriceFilter from "../components/SearchFilters/PriceFilter";

const Search = () => {
    const search = useSearchContext();
    const [page, setPage] = useState<number>(1);
    const [selectedStars, setSelectedStars] = useState<string[]>([]);
    const [selectedHotelTypes, setSelectedHotelTypes] = useState<string[]>([]);
    const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
    const [selectedMaxPrice, setMaxSelectedPrice] = useState<number | undefined>();
    const [sortOption, setSortOption] = useState<string>("");

    const searchParams = {
        destination: search.destination,
        checkIn: search.checkIn.toISOString(),
        checkOut: search.checkOut.toISOString(),
        adultCount: search.adultCount.toString(),
        childCount: search.childCount.toString(),
        page: page.toString(),
        stars: selectedStars,
        types: selectedHotelTypes,
        facilities: selectedFacilities,
        maxPrice: selectedMaxPrice?.toString(),
        sortOption,
    };
    
    const { data: hotelData } = useQuery(["searchHotels", searchParams], () => apiClient.searchHotels(searchParams));

    const handleStarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const starRating = event.target.value;

        setSelectedStars((prevStars) => event.target.checked ? [...prevStars, starRating] : prevStars.filter((star) => star !== starRating)); // Check if the star rating is already in the array, if it is, remove it, otherwise add it 
    };

    const handleHotelTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const hotelType = event.target.value;

        setSelectedHotelTypes((prevTypes) => event.target.checked ? [...prevTypes, hotelType] : prevTypes.filter((type) => type !== hotelType)); // Check if the hotel type is already in the array, if it is, remove it, otherwise add it
    };

    const handleFacilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const facility = event.target.value;

        setSelectedFacilities((prevFacilities) => event.target.checked ? [...prevFacilities, facility] : prevFacilities.filter((prevFacility) => prevFacility !== facility)); // Check if the facility is already in the array, if it is, remove it, otherwise add it
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-5">
            <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10">
                <div className="space-y-5">
                    <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
                        Filter by:
                    </h3>
                    <StarRatingFilter selectedStars={selectedStars} onChange={handleStarChange}/>
                    <HotelTypesFilter selectedHotelTypes={selectedHotelTypes} onChange={handleHotelTypeChange}/>
                    <FacilitiesFilter selectedFacilities={selectedFacilities} onChange={handleFacilityChange}/>
                    <PriceFilter selectedPrice={selectedMaxPrice} onChange={(value?:number) => setMaxSelectedPrice(value)}/>
                </div>
            </div>

            <div className="flex flex-col gap-5">
                <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">
                        {hotelData?.pagination.total} Hotel(s) found
                        {search.destination? ` in ${search.destination}` : ""}
                    </span>
                    <select value={sortOption} onChange={(event) => setSortOption(event.target.value)} className="p-2 border rounded-md" title="Sort Order">
                        <option value="">Sort By</option>
                        <option value="starRating">Star Rating</option>
                        <option value="pricePerNightAsc">Price Per Night (low to high)</option>
                        <option value="pricePerNightDesc">Price Per Night (high to low)</option>
                    </select>
                </div>
                {hotelData?.data.map((hotel) => (
                    <SearchResultsCard hotel={hotel} />
                ))}
                <div>
                    <Pagination page={hotelData?.pagination.page || 1} totalPages={hotelData?.pagination.pages || 1} onPageChange={(page) => setPage(page)}/>
                </div>
            </div>

        </div>
    );
};

export default Search;