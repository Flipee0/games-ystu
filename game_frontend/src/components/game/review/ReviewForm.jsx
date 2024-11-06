import React, {useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import AuthStore from "../../../store";
import authStore from "../../../store";
import {Input} from "../../Input";
import {login_validation, password_validation, textarea} from "../../../utils/inputValidations";
import {FormProvider, useForm} from "react-hook-form";
import {instance} from "../../../api.config";

const ReviewForm = ({id, isAuth, default_text, default_rating, closeForm}) => {
    const methods = useForm()
    const [rating, setRating] = useState(default_rating == null ? 5 : default_rating)
    const [load, setLoad] = useState(false)
    const [isSent, setIsSent] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)

    const onSubmit = methods.handleSubmit(data => {
        setLoad(true)
        setIsSent(true)
        if (default_rating) {
            instance.post("/review/edit_my_review?game_id=" + id, {
                rating: rating,
                text: data.text
            }).then((e) => {
                setSuccess(true)
                setLoad(true)
                document.location.reload()
            }).catch((err) => {
                const code = err.request.status
                if (code === 400) {
                    setError("Отзыв не найден")
                }
                else {
                    setError("Во время изменения отзыва произошла ошибка")
                }
            }).finally((e) => {
                setLoad(false)
            })
        }
        else {
            instance.post("/review/add?game_id=" + id, {
                rating: rating,
                text: data.text
            }).then((e) => {
                setSuccess(true)
                setLoad(true)
                document.location.reload()
            }).catch((err) => {
                const code = err.request.status
                if (code === 400) {
                    setError("Вы уже оставили отзыв!")
                }
                else {
                    setError("Во время отправки отзыва произошла ошибка")
                }
            }).finally((e) => {
                setLoad(false)
            })
        }
    })
    return (
        <div>
            {isAuth &&
                <div>
                    <FormProvider {...methods}>
                        <form
                            onSubmit={e => e.preventDefault()}
                            noValidate
                            autoComplete="off"
                            className="container"
                        >
                            <div className="container mt-2">
                                <div className="grid gap-5 md:grid-cols-2">
                                    <h5>Оставить отзыв</h5>
                                    <div className="btn-group text-center" role="group" aria-label="Rating">
                                        <div className="input-group-text" id="btnGroupAddon2">Оценка</div>
                                        {Array.from(Array(11).keys()).map((value) =>
                                            <button
                                                onClick={() => setRating(value)}
                                                className={"btn border " + (rating === value ? "bg-primary" : "bg-body")}>
                                                {value}
                                            </button>
                                        )}
                                    </div>
                                    <Input {...textarea("text", 4000)} defaultValue={default_text}/>
                                </div>
                            </div>
                            <div className="container">
                                <div className="btn-group" role="group" aria-label="">
                                    <button
                                        onClick={onSubmit}
                                        type="button"
                                        className={"btn btn-outline-primary" + (load ? " disabled" : "")}
                                    >
                                        Отправить
                                    </button>
                                    {closeForm &&
                                        <button type="button" className="btn btn-outline-primary" onClick={closeForm}>Отмена</button>
                                    }
                                </div>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            }
            {load && <p>Загрузка...</p>}
            {!load && isSent && !success &&
                <div className="mt-5">
                    <div className="alert alert-danger" role="alert">
                        <h6 className="alert-heading">Ошибка:</h6>
                        <p>
                            {error}
                        </p>
                    </div>
                </div>
            }
            {!isAuth &&
                <div className="mt-1">
                    <div className="alert alert-primary" role="alert">
                        <h6 className="alert-heading">Войдите, чтобы оставить комментарий</h6>
                    </div>
                </div>
            }
        </div>
    );
};

export default ReviewForm;