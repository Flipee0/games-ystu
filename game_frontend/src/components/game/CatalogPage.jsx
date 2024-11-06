import React, {useEffect, useState} from 'react';
import CatalogElement from "./CatalogElement";
import {instance} from "../../api.config";
import GameSearch from "./GameSearch";
import {useParams} from "react-router-dom";
import {getImage} from "../../utils/GetImage";

const CatalogPage = () => {
    const { series_id } = useParams()
    const [seriesInfo, setSeriesInfo] = useState(true);
    const [seriesLogo, setSeriesLogo] = useState(true);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [games, setGames] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const [fetching, setFetching] = useState(true)
    const [loadAll, setLoadAll] = useState(false)

    const [searchParams, setSearchParams] = useState(null)
    const [forceUpdate, setForceUpdate] = useState(null)

    const scrollHandler = (e) => {
        if (e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 300) {
            setFetching(true)
        }
    }

    const searchHandler = (params) => {
        setGames([])
        setLoadAll(false)
        setCurrentPage(0)
        setSearchParams(params)
        if (fetching) {
            setForceUpdate(!forceUpdate)
        }
        else {
            setFetching(true)
        }
    }

    useEffect(() => {
        if (fetching && !loadAll) {
            setLoading(true)
            let url = `/game/read-objects?limit=10&offset=${10 * currentPage}`
            if (series_id != null) {
                url += "&series_id=" + series_id + "&order_by=release_date"
            }
            let filters
            if (searchParams) {
                if (searchParams.searchValue !== "") {
                    url += `&filter_field=${searchParams.searchParam}&filter_value=${searchParams.searchValue}`
                }
                filters = {
                    genres_ids: searchParams.filterGenres,
                    platforms_ids: searchParams.filterPlatforms,
                    locales_ids: searchParams.filterLocales,
                    developers_ids: searchParams.filterDevelopers,
                    distributors_ids: searchParams.filterDistributors,
                }
            }
            else {
                filters = null
            }
            instance.post(url, filters)
                .then((response) => response.data)
                .then((actualData) => {
                    if (actualData.length === 0) {
                        setLoadAll(true)
                    }
                    setGames([...games, ...actualData])
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
    }, [fetching, forceUpdate])

    useEffect(() => {
        document.addEventListener("scroll", scrollHandler)

        return function () {
            document.removeEventListener("scroll", scrollHandler)
        }
    }, [])

    useEffect(() => {
        if (series_id != null) {
            setLoading(true)
            instance.get("/series/read-object?object_id=" + series_id).then((data) => {
                setSeriesInfo(data.data)
                getImage(data.data.logo).then((res) => setSeriesLogo(res))
            }).catch(() =>
                setSeriesInfo(null)
            ).finally(() =>
                setLoading(false)
            )
        }
    }, [])


    return (
        <div>
            {series_id == null &&
                <div className="container">
                    <GameSearch searchHandler={searchHandler} series_id={series_id}/>
                </div>
            }
            {series_id != null &&
                <div className="container">
                    <a className="btn btn-outline-primary" href="/games"><i className="fa fa-arrow-left" aria-hidden="true"></i>Перейти к странице игр</a>
                    {seriesInfo && !loading &&
                        <>
                            <div className="row mt-2 rounded shadow p-2">
                                <div className="col-md-4">
                                    <img className="w-100" src={seriesLogo}/>
                                </div>
                                <div className="col-md-8">
                                    <h2 className="">Серия игр "{seriesInfo.name}"</h2>
                                    {seriesInfo.description.split("\n").map((paragraph) => <p className="text-wrap">{paragraph}</p>)}
                                </div>
                            </div>
                            <div className="row">
                                <h2 className="text-center mt-2 mb-2">Игры серии</h2>
                            </div>
                        </>
                    }
                    {!seriesInfo && !loading &&
                        <h2 className="text-center">Серия игр не найдена</h2>
                    }
                </div>
            }
            {games.map((game) =>
                <CatalogElement game={game}/>)}
            {loading && <div>A moment please...</div>}
            {error && (
                <div>{`There is a problem fetching the post data - ${error}`}</div>
            )}
        </div>
    );
};

export default CatalogPage;