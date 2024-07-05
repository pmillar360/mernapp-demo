const Footer = () => {
    return (
        <div className="bg-blue-800 py-10">
            <div className="container mx-auto flex justify-between items-center">
                <span className="text-3xl text-white font-bold tracking-tight">
                    MernApp
                </span>
                <span className="text-white font-bold tracking-tight flex gap-4">
                    <p className="cursor-default">Bazinga</p>
                    <p className="cursor-pointer">About</p>
                </span>
            </div>
        </div>
    )
}

export default Footer;