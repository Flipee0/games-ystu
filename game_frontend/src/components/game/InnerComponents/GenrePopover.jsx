import React from 'react';
import {Tooltip} from "react-tippy";

const GenrePopover = ({object}) => {
    const {name, description} = object
    return (
        <div className="flex-grow-1 me-1">
            <Tooltip
                html={(
                    <div className="card shadow">
                        <div className="card-body">
                            <p className="card-text">{description}</p>
                        </div>
                    </div>
                )}
                position="bottom"
                trigger="mouseenter"
            >
                <a className="btn border w-100">{name}</a>
            </Tooltip>
        </div>
    );
};

export default GenrePopover;