import React, {useEffect, useState} from 'react';
import {Tooltip} from "react-tippy";
import {getImage} from "../../../utils/GetImage";

const CompanyPopover = (object) => {
    const {name, logo, country, description} = object.object
    const [load, setLoad] = useState(true)
    const [image, setImage] = useState(null)

    useEffect(() => {
        setLoad(true)
        getImage(logo).then((res) => {
            setImage(res)
            setLoad(false)
        })
    }, [])

    return (
        <div className="flex-grow-1">
            <div className="me-1">
                <Tooltip
                    hideOnClick={true}
                    interactive={true}
                    html={(
                        <div className="d-flex justify-content-center">
                            {load &&
                                <div className="d-flex align-items-center">
                                    <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                                </div>
                            }
                            {!load &&
                                <div className="card h-25 w-25 shadow">
                                    <img src={image} className="card-img-top border border-0 rounded" alt="logo"/>
                                    <div className="card-body">
                                        <h5 className="card-title">{name}</h5>
                                        <p>{country}</p>
                                        {description.split("\n").map((paragraph) => <p className="text-wrap">{paragraph}</p>)}
                                    </div>
                                </div>
                            }
                        </div>
                    )}
                    position="bottom"
                    trigger="mouseenter"
                >
                    <a className="btn border w-100">{name}</a>
                </Tooltip>
            </div>
        </div>
    );
};

export default CompanyPopover;