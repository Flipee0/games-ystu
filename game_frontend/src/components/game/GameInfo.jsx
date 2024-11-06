import React, {useEffect, useState} from 'react';
import {getImage} from "../../utils/GetImage";
import Rating from "./Rating";
import AgeRating from "./AgeRating";
import GenrePopover from "./InnerComponents/GenrePopover";
import CompanyPopover from "./InnerComponents/CompanyPopover";
import ReviewForm from "./review/ReviewForm";
import CurrentUserReview from "./review/CurrentUserReview";
import ReviewsBlock from "./review/ReviewsBlock";
import Reviews from "./review/Reviews";
import SeriesPopover from "./InnerComponents/SeriesPopover";

const GameInfo = (props) => {
    const [image, setImage] = useState(null)
    const [load, setLoad] = useState(true)

    useEffect(() => {
        setLoad(true)
        getImage(props.game.logo).then((value) => setImage(value))
        setLoad(false)
        console.log()
    }, [])
    return (
        <>
            <div className="container mb-3 shadow p-4 mt-2 rounded overflow-x-hidden">
                <div className="row">
                    <div className="col-md-4">
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
                        {props.game.series &&
                            <div className="d-flex align-items-center mb-2">
                                <p className="mb-0 me-2">Серия:</p>
                                <SeriesPopover object={props.game.series}/>
                            </div>
                        }
                        <div className="mb-2">
                            <h5 className="mb-1 me-2 text-center">Жанры</h5>
                            <div className="d-flex flex-wrap">{props.game.genres.map((genre) => <GenrePopover object={genre}/>)}</div>
                        </div>
                        <div className="mb-2">
                            <h5 className="mb-1 me-2 text-center">Платформы</h5>
                            <div className="d-flex flex-wrap justify-content-center">{props.game.platforms.map((platform) => <a className="btn border flex-grow-1">{platform.name}</a>)}</div>
                        </div>
                        <div className="mb-2">
                            <h5 className="mb-1 me-2 text-center">Издатели</h5>
                            <div className="d-flex flex-wrap">{props.game.distributors.map((distributor) => <CompanyPopover object={distributor}/>)}</div>
                        </div>
                        <div className="">
                            <h5 className="mb-1 me-2 text-center">Разработчики</h5>
                            <div className="d-flex flex-wrap">{props.game.developers.map((developer) => <CompanyPopover object={developer}/>)}</div>
                        </div>
                        <div className="mb-2">
                            <h5 className="mb-1 me-2 text-center">Локализация</h5>
                            <div className="d-flex flex-wrap justify-content-center">{props.game.locales.map((locale) => <a className="btn border flex-grow-1">{locale.language}</a>)}</div>
                        </div>
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
            <div className="row d-flex justify-content-center mt-4 col-md-12">
                <h3 className="text-center">Описание</h3>
                <div className="col-md-6">
                    {props.game.description.split("\n").map((paragraph) => <p className="text-wrap" style={{textAlign: "justify"}}>{paragraph}</p>)}
                </div>
            </div>
            <div className="row d-flex justify-content-center mt-4 col-md-12">
                <h3 className="text-center">Обзоры</h3>
                <div className="col-md-6">
                    <Reviews id={props.game.id}/>
                </div>
            </div>
        </>
    );
};

export default GameInfo;