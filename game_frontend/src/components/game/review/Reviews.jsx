import React, {useEffect} from 'react';
import CurrentUserReview from "./CurrentUserReview";
import ReviewsBlock from "./ReviewsBlock";

const Reviews = ({id}) => {
    return (
        <>
            <CurrentUserReview id={id}/>
            <ReviewsBlock id={id}/>
        </>
    );
};

export default Reviews;