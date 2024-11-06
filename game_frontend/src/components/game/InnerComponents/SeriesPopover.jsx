import React, {useEffect, useState} from 'react';
import {getImage} from "../../../utils/GetImage";
import {Tooltip} from "react-tippy";

const SeriesPopover = ({object}) => {
    const {name, logo, description} = object
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
        <div>
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
                                        {description.split("\n").map((paragraph) => <p className="text-wrap">{paragraph}</p>)}
                                        <a className="btn btn-outline-primary" href={"/games/series/" + object.id}>Перейти к серии игр</a>
                                    </div>
                                </div>
                            }
                        </div>
                    )}
                    position="bottom"
                    trigger="mouseenter"
                >
                    <a className="btn border">{name}</a>
                </Tooltip>
            </div>
        </div>
    );
};

export default SeriesPopover;