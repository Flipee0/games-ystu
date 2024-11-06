import React, {useState} from 'react';
import AdditionalInfo from "../AdditionalInfo";
import ObjectsTable from "./edit/ObjectsTable";

const RelativeInfo = ({objects}) => {
    const [data, setData] = useState(Array.isArray(objects) ? objects : [objects])
    return (
        <div>
            {data.length ?
                <AdditionalInfo>
                    <ObjectsTable objects={data}/>
                </AdditionalInfo>
                : "Нет"
            }
        </div>
    );
};

export default RelativeInfo;