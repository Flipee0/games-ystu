import React, {useEffect, useState} from 'react';
import AuthStore from "../../../store";
import authStore from "../../../store";
import ReviewForm from "./ReviewForm";
import {instance} from "../../../api.config";
import ReviewCard from "./ReviewCard";

const CurrentUserReview = ({id}) => {
    const [load, setLoad] = useState(true)
    const [review, setReview] = useState()
    const [deletionError, setDeletionError] = useState(false)
    const [isEdit, setIsEdit] = useState(false)

    const disableEdit = () => {
        setIsEdit(false)
    }

    useEffect(() => {
        setLoad(true)
        AuthStore.checkAuth();
        if (authStore.isAuth) {
            instance.get("/review/get-my-review?game_id=" + id).then((data) => {
                setReview(data.data)
            }).catch(() => {
                setReview(null)
            }).finally(() => {
                setLoad(false)
            })
        }
        else {
            setLoad(false)
        }
    }, []);

    const deleteHandler = () => {
        setLoad(true)
        AuthStore.checkAuth();
        if (authStore.isAuth) {
            instance.post("/review/delete_my_review?game_id=" + id).then((data) => {
                setDeletionError(false)
                document.location.reload()
            }).catch(() => {
                setDeletionError(true)
            }).finally(() => {
                setLoad(false)
            })
        }
        else {
            setLoad(false)
        }
    }

    return (
        <div>
            {review && !load && !isEdit &&
                <div className="border rounded shadow p-4">
                    <ReviewCard data={review}/>
                    <div className="btn-group" role="group" aria-label="">
                        <button type="button" className="btn btn-outline-primary mt-3" onClick={() => setIsEdit(true)}>Редактировать</button>
                        <button type="button" className="btn btn-outline-primary mt-3" onClick={deleteHandler}>Удалить</button>
                    </div>
                </div>
            }
            {!review && !load &&
                <div className="mb-5">
                    <ReviewForm id={id} isAuth={authStore.isAuth}/>
                </div>
            }
            {deletionError && !load &&
                <div className="mt-2">
                    <div className="alert alert-danger" role="alert">
                        <h6 className="alert-heading">Ошибка при удалении отзыва</h6>
                    </div>
                </div>
            }
            {review && !load && isEdit &&
                <div className="mb-5">
                    <ReviewForm id={id} isAuth={authStore.isAuth} default_text={review.text} default_rating={review.rating} closeForm={disableEdit}/>
                </div>
            }
        </div>
    );
};

export default CurrentUserReview;