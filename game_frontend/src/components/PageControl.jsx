import React, {Children, useEffect, useState} from 'react';
import {instance} from "../api.config";

const PageControl = ({page, decrement, increment, blockIncrement}) => {
    return (
        <div>
            <div className="input-group">
                <button className={"btn btn-outline-secondary" + (page === 1 ? " invisible" : "")} type="button" id="button-addon1" onClick={() => decrement()}>-</button>
                <span className="input-group-text">{page}</span>
                <button className={"btn btn-outline-secondary" + (blockIncrement ? " invisible" : "")} type="button" id="button-addon1" onClick={() => increment()}>+</button>
            </div>
        </div>
    );
};

export default PageControl;