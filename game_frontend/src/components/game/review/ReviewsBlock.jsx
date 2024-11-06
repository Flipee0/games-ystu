import React, {useEffect, useState} from 'react';
import {instance} from "../../../api.config";
import ReviewCard from "./ReviewCard";
import AuthStore from "../../../store"
import authStore from "../../../store";

const ReviewsBlock = ({id}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [reviews, setReviews] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const [fetching, setFetching] = useState(true)
    const [loadAll, setLoadAll] = useState(false)

    const [editId, setEditId] = useState(null)

    const editHandler = (id, text, updateReason) => {
        instance.post("/review/edit_any_review", {
            id: id,
            text: text,
            update_reason: updateReason
        }).then(() => {
            setEditId(null)
            const review_index = reviews.findIndex((review) => review.id === id)
            reviews[review_index].text = text
            reviews[review_index].update_reason = updateReason
        })
    }

    const deleteHandler = (id) => {
        instance.post("/review/delete_any_review?review_id=" + id).then(() => {
            const deleted_index = reviews.findIndex((review) => review != null && review.id === id)
            setReviews([...reviews.slice(0, deleted_index), null, ...reviews.slice(deleted_index + 1, reviews.length)])
        })
    }

    const scrollHandler = (e) => {
        if (e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 300) {
            setFetching(true)
        }
    }

    useEffect(() => {
        AuthStore.checkAuth()
        if (fetching && !loadAll) {
            setLoading(true)
            instance.get("/review/get-game-reviews?limit=10&offset=" + 10 * currentPage + "&game_id=" + id)
                .then((response) => response.data)
                .then((actualData) => {
                    if (actualData.length === 0) {
                        setLoadAll(true)
                    }
                    setReviews([...reviews, ...actualData])
                    setError(null);
                    setCurrentPage(currentPage + 1)
                })
                .catch((err) => {
                    setError(err.message);
                })
                .finally(() => {
                    setFetching(false)
                    setLoading(false)
                });
        }
    }, [fetching])

    useEffect(() => {
        document.addEventListener("scroll", scrollHandler)

        return function () {
            document.removeEventListener("scroll", scrollHandler)
        }
    }, [])

    return (
        <div>
            {
                reviews.map((review) => review == null ? <p>Отзыв удален</p> :
                    <div className="mt-4 border-bottom pb-2">
                        {authStore.isModer &&
                            <div className="d-flex">
                                <div className="btn-group mb-2 ms-auto">
                                    <button className="btn btn-outline-primary" onClick={
                                        () => setEditId(review.id === editId ? null : review.id)
                                    }>
                                        <i className="fa fa-pencil"></i>
                                    </button>
                                    <button className="btn btn-outline-primary" onClick={() => deleteHandler(review.id)}>
                                        <i className="fa fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        }
                        {editId === review.id && <ReviewCard data={review} editHandler={editHandler}/>}
                        {editId !== review.id && <ReviewCard data={review}/>}
                    </div>
                )
            }
        </div>
    );
};

export default ReviewsBlock;