import React, {useEffect, useState} from 'react';
import {instance} from "../../api.config";
import CatalogElement from "./CatalogElement";
import {useParams} from "react-router-dom";
import GameInfo from "./GameInfo";

const GamePage = () => {
    const id = Number(useParams().id);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        instance.get("/game/read-object?object_id=" + id)
            .then((response) => response.data)
            .then((actualData) => {
                setData(actualData);
                setError(null);
            })
            .catch((err) => {
                setError(err.message);
                setData(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [])

    return (
        <div>
            {loading && <div>A moment please...</div>}
            {error && (
                <div>{`There is a problem fetching the post data - ${error}`}</div>
            )}
            {!loading && !error && <GameInfo game={data}/>}
        </div>
    );
};

export default GamePage;