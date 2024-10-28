interface PageLayoutProps {
    children: React.ReactNode;
    isFirstPage?: boolean;
    name?: string;
}

export default function PageLayout({
    children,
    isFirstPage = false,
    name,
}: PageLayoutProps) {
    return (
        <div className="h-screen bg-white flex flex-col">
            <div className="relative flex justify-center gap-4 px-8 py-8">
                <h1 className="text-4xl font-bold text-black">Select Model</h1>
                {isFirstPage && (
                    <button
                        className="absolute right-8 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                        onClick={() => console.log("Upload Image clicked")}
                    >
                        Move To DataSet
                    </button>
                )}
            </div>
            <div className="flex-1 w-full px-8 pb-8 flex flex-col">
                <div className="flex-1 bg-gray-50 rounded-lg shadow-lg p-8 flex flex-col">
                    <div className="mb-8 flex items-center">
                        <label className="text-xl font-semibold whitespace-nowrap mr-4 text-black">
                            Name :{" "}
                        </label>
                        {isFirstPage ? (
                            <input
                                type="text"
                                className="flex-1 p-2 border rounded-lg text-white"
                                placeholder="Upload at 2024-10-24 T13:32 with Object Detection"
                            />
                        ) : (
                            <span className="flex-1 p-2 text-black">
                                {name ||
                                    "Upload at 2024-10-24 T13:32 with Object Detection"}
                            </span>
                        )}
                    </div>
                    <div className="flex-1">{children}</div>
                </div>
            </div>
        </div>
    );
}
