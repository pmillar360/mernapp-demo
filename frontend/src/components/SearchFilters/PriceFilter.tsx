type Props = {
    selectedPrice?: number;
    onChange: (value?: number) => void;
};

const PriceFilter = ({ selectedPrice, onChange }: Props) => {
    return (
        <div>
            <h4 className="text-md font-semibold mb-2">Max Price</h4>
            <select value={selectedPrice} onChange={(event) => onChange(event.target.value ? parseInt(event.target.value) : undefined)} title="Selected Max Price" className="p-2 border rounded-md w-full">
                <option value="">Select Max Price</option>
                {[50, 100, 150, 200, 250, 300, 350, 400, 450, 500].map((price) => (
                    <option value={price} key={price}>${price}</option>
                ))}
            </select>
        </div>
    );
};

export default PriceFilter;