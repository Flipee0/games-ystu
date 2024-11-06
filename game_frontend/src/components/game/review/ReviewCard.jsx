import React, {useEffect, useState} from 'react';
import {getImage} from "../../../utils/GetImage";
import {Tooltip} from "react-tippy";
import Rating from "../Rating";
import getDocumentElement from "@popperjs/core/lib/dom-utils/getDocumentElement";
import placeholder from "../../../static/images/AvatarPlaceholder.png"
import {FormProvider, useForm} from "react-hook-form";
import {max_byte_length_validation, textarea} from "../../../utils/inputValidations";
import {Input} from "../../Input";

const ReviewCard = ({data, editHandler}) => {
    const methods = useForm()
    const [loadImage, setLoadImage] = useState(true)
    const [image, setImage] = useState(true)

    useEffect(() => {
        setLoadImage(true)
        getImage(data.user.avatar).then((res) => {
            setImage(res)
            setLoadImage(false)
        })
    }, [])

    const onSubmit = methods.handleSubmit(newData => {
        editHandler(data.id, newData.text, newData.update_reason)
    })

    return (
        <div className="row">
            <div className="col-md-2">
                {loadImage &&
                    <p></p>
                }
                {!loadImage && image &&
                    <img className="w-100 rounded-circle shadow" src={image} alt="Avatar"/>
                }
                {!image &&
                    <div
                        className="w-100 rounded-circle text-center align-items-center shadow"
                        style={{aspectRatio: 1, backgroundImage: `url(${placeholder})`, backgroundPosition: "center",  backgroundRepeat: "no-repeat", backgroundSize: "70%"}}>
                    </div>
                }
            </div>
            <div className="col-md-9">
                <div className="d-flex align-items-center mb-2">
                    <h4 className="mb-0 me-1">{data.user.login}</h4>
                    <Tooltip
                        title={data.user.role}
                    >
                        {data.user.role === "Администратор" && <i className="fa fa-cog"></i>}
                        {data.user.role === "Модератор" && <i className="fa fa-pencil"></i>}
                        {data.user.role === "Пользователь" && <i className="fa fa-user"></i>}
                    </Tooltip>

                </div>
                <p className="fst-italic text-secondary">{new Date(data.date).toLocaleString("ru-RU", {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric'
                })}</p>
                {!editHandler &&
                    data.text.split("\n").map((paragraph) => <p className="text-wrap" style={{textAlign: "justify"}}>{paragraph}</p>)
                }
                {editHandler &&
                    <FormProvider {...methods}>
                        <form
                            onSubmit={e => e.preventDefault()}
                            noValidate
                            autoComplete="off"
                            className="container"
                        >
                            <Input {...textarea("text", 4000)} defaultValue={data.text}/>
                            <Input {...max_byte_length_validation("update_reason", 64)} defaultValue={data.update_reason}/>
                            <button className="btn btn-outline-primary mt-1" onClick={onSubmit}>Применить</button>
                        </form>
                    </FormProvider>
                }
                {data.updated_at &&
                    <>
                        <p className="fst-italic text-secondary">
                            Изменено: {new Date(data.updated_at).toLocaleString("ru-RU", {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric'
                            })},
                            Пользователем: {data.updated_by.login}<Tooltip
                                title={data.updated_by.role}
                            >
                                {data.updated_by.role === "Администратор" && <i className="fa fa-cog"></i>}
                                {data.updated_by.role === "Модератор" && <i className="fa fa-pencil"></i>}
                                {data.updated_by.role === "Пользователь" && <i className="fa fa-user"></i>}
                            </Tooltip>
                            {data.update_reason &&
                                ", По причине: " + data.update_reason
                            }
                        </p>
                    </>
                }

            </div>
            <div className="col-md-1">
                <Rating rating={data.rating} round={0}/>
            </div>
        </div>
    );
};

export default ReviewCard;