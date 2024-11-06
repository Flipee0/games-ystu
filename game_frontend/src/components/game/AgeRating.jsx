import React from 'react';

const AgeRating = (props) => {
    return (
        <div
            className="border rounded-circle d-inline-block align-middle p-3 shadow bg-primary"
            style={{aspectRatio: "1 / 1"}}
        >
            <div className="h-100 d-flex align-items-center justify-content-center">
                <h3 className="text-center mb-0">{props.age_rating + "+"}</h3>
            </div>
        </div>
    );
};

export default AgeRating;