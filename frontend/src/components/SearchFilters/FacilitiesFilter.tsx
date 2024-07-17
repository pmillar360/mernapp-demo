import React from "react";
import { hotelFacilities } from "../../config/hotel-options-config";

type Props = {
    selectedFacilities: string[];
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const FacilitiesFilter = ({ selectedFacilities: selectedFacilities, onChange }: Props) => {
    return (
        <div className="border-b border-slate-300 pb-5">
            <h4 className="text-md font-semibold mb-2">Facilities</h4>
            {hotelFacilities.sort().map((facility) => (
                <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" value={facility} checked={selectedFacilities.includes(facility)} onChange={onChange} title={`${facility} Hotel Facility Checkbox`}/>
                    <span>{facility}</span>
                </label>
            ))}
        </div>
    );
};

export default FacilitiesFilter;