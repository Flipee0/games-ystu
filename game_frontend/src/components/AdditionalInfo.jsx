import React, {useState} from 'react';
import {Outlet} from "react-router-dom";

const AdditionalInfo = ({ children, title }) => {
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseOver = () => {
        setIsHovering(true);
    };

    const handleMouseOut = () => {
        setIsHovering(false);
    };
    return (
        <div>
            {title != null ?
                <p>
                    {title}
                </p>
                : null
            }
            <div
                className="border rounded-circle d-inline-block align-middle p-2 shadow bg-primary"
                style={{aspectRatio: "1 / 1"}}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
            >
                <div className="h-100 d-flex align-items-center justify-content-center">
                    <p className="text-center mb-0 fst-italic">i</p>
                </div>
            </div>
            {isHovering &&
                <div className="position-absolute">
                    {children}
                </div>
            }
        </div>
    );
};

export default AdditionalInfo;