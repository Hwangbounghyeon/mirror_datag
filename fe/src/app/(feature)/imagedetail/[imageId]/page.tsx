import React from "react";
import Header from "./../../../../components/imagedeatil/header";

//TODO 해당 페이지에는 왼쪽에 바가 없도록
function page() {
    return (
        <div>
            <Header fileName="dog.png" currentNumber={1} totalCount={300} />
        </div>
    );
}

export default page;
