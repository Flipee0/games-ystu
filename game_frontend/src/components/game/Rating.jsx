import React from 'react';

const Rating = (props) => {
    const color_config = new Map();
    color_config
        .set(0, '#dc3545')
        .set(1, '#dc3545')
        .set(2, '#dc3545')
        .set(3, '#dc3545')
        .set(4, '#dc3545')
        .set(5, '#ffc107')
        .set(6, '#ffc107')
        .set(7, '#ffc107')
        .set(8, '#28a745')
        .set(9, '#28a745')
        .set(10, '#28a745')

    return (
        <div
            className="border rounded-circle d-inline-block align-middle p-3 shadow"
            style={{aspectRatio: "1 / 1", backgroundColor: color_config.get(Math.trunc(props.rating))}}
        >
            <div className="h-100 d-flex align-items-center justify-content-center">
                <h3 className="text-center mb-0">{props.rating.toFixed(props.round)}</h3>
            </div>
        </div>
    );
};

export default Rating;