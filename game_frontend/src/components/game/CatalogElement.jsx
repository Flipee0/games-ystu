import React, {useEffect, useState} from 'react';
import logo_test from '../../static/images/example_logo.jpg'
import {getImage} from "../../utils/GetImage";
import Rating from "./Rating";
import AgeRating from "./AgeRating";

const CatalogElement = (props) => {
    const [image, setImage] = useState(null)
    const [load, setLoad] = useState(true)

    useEffect(() => {
        setLoad(true)
        getImage(props.game.logo).then((value) => setImage(value))
        setLoad(false)
    }, [])

    return (
        <a className="text-decoration-none text-reset" href={"/games/" + props.game.id} key={props.game.id}>
            <div className="container mb-3 shadow p-4">
                <div className="row">
                    <div className="col-md-4 ">
                        {!load && image &&
                            <img className="img-fluid border rounded shadow" src={image} alt="Логотип игры"/>
                        }
                        {image == null &&
                            <div className="h-100 d-flex align-items-center justify-content-center border rounded shadow">
                                <h1 className="text-center">Изображение недоступно</h1>
                            </div>
                        }
                    </div>
                    <div className="col-md-6">
                        <h2 className="fw-bold">{props.game.name}</h2>
                        <p>
                            Дата релиза: {new Date(props.game.release_date).toLocaleString("ru", {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                        <p>Жанры: {props.game.genres.map((genre) => genre.name).join(", ")}</p>
                        <p>Платформы: {props.game.platforms.map((platform) => platform.name).join(", ")}</p>
                        <p>Издатели: {props.game.distributors.map((distributor) => distributor.name).join(", ")}</p>
                        <p>Разработчики: {props.game.developers.map((developer) => developer.name).join(", ")}</p>
                    </div>
                    <div className="col-md-2">
                            <div className="row">
                                <div className="col-md-8 d-flex align-items-center justify-content-center mb-2">
                                    {props.game.rating != null ? <Rating rating={props.game.rating} round={2}/> : null}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-8 d-flex align-items-center justify-content-center">
                                    <AgeRating age_rating={props.game.age_rating}/>
                                </div>
                            </div>
                    </div>
                </div>
            </div>
        </a>
    );
};

export default CatalogElement;