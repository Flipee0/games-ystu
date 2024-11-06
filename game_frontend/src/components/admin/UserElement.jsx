import React, {useEffect, useState} from 'react';
import {getImage} from "../../utils/GetImage";
import placeholder from "../../static/images/AvatarPlaceholder.png";

const UserElement = ({data, grantHandler}) => {
    const [image, setImage] = useState()
    const [loadImage, setLoadImage] = useState(true)

    useEffect(() => {
        setLoadImage(true)
        getImage(data.avatar).then((res) => {
            setImage(res)
            setLoadImage(false)
        })
    }, [])

    return (
        <div className="row rounded shadow p-2 mb-2">
            <div className="col-md-1 col-sm-2">
                {!loadImage && image != null && <img className="w-100 rounded-circle shadow" src={image}/>}
                {!loadImage && image == null &&
                    <div
                        className="w-100 rounded-circle text-center align-items-center shadow"
                        style={{aspectRatio: 1, backgroundImage: `url(${placeholder})`, backgroundPosition: "center",  backgroundRepeat: "no-repeat", backgroundSize: "70%"}}>
                    </div>
                }
            </div>
            <div className="col-md-8 col-sm-6">
                <h5>{data.login}</h5>
                <p className="m-0">{data.role}</p>
                <p className="fst-italic text-secondary">Дата регистрации: {new Date(data.registration_date).toLocaleString("ru-RU", {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric'
                })}</p>
            </div>
            {data.role !== "Администратор" &&
                <div className="col-md-3">
                    <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                        <button className="btn btn-outline-primary" onClick={() => grantHandler(data.id, data.role)}>
                            {data.role === "Пользователь" ? "Повысить до модератора" : "Понизить до пользователя"}
                        </button>
                    </div>
                </div>
            }
        </div>
    );
};

export default UserElement;