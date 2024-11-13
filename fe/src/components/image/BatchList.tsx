// "use client";

// import React from "react";
// import { FaRegCheckCircle } from "react-icons/fa";
// import { IoMdCloseCircleOutline } from "react-icons/io";

// const BatchList = () => {
//     const batches = [
//         {
//             id: 4,
//             date: "2024-10-26",
//             imageCount: 12,
//             isLoaded: true,
//         },
//         {
//             id: 3,
//             date: "2024-10-25",
//             imageCount: 8,
//             isLoaded: false,
//         },
//         {
//             id: 2,
//             date: "2024-10-24",
//             imageCount: 15,
//             isLoaded: true,
//         },
//     ];

//     return (
//         <div className="flex flex-col space-y-4">
//             {batches.map((batch) => (
//                 <div key={batch.id} className={`p-4 border rounded-lg`}>
//                     <h2 className="text-lg font-bold">{batch.date}</h2>
//                     <p className="text-sm">{batch.imageCount} images</p>
//                     <div className="flex justify-end items-end">
//                         {batch.isLoaded ? (
//                             <FaRegCheckCircle className="text-green-500 size-6" />
//                         ) : (
//                             <IoMdCloseCircleOutline className="text-red-500 size-6" />
//                         )}
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default BatchList;
