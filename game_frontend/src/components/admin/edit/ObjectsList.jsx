import React, {useEffect, useRef, useState} from 'react';
import {instance} from "../../../api.config";
import CatalogElement from "../../game/CatalogElement";
import {useParams} from "react-router-dom";
import ObjectElement from "./ObjectElement";
import ObjectsTable from "./ObjectsTable";
import PageControl from "../../PageControl";
import Select from "react-select";
import {available_filter_attributes} from "../../FIlterFields";
import DeletionAlert from "./DeletionAlert";

const ObjectsList = ({ enableEditor }) => {
    const params = useParams();
    const entity = params.entity;
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const init = useRef(true);

    const [isForward, setIsForward] = useState(null)
    const [prevData, setPrevData] = useState(null);
    const [data, setData] = useState(null);
    const [nextData, setNextData] = useState(null);
    const [blockIncrement, setBlockIncrement] = useState(false);

    const [searchParam, setSearchParam] = useState(available_filter_attributes[entity][0].value)
    const [searchValue, setSearchValue] = useState("")
    const [search, setSearch] = useState(false)

    const [updateTrigger, setUpdateTrigger] = useState(false)

    const [orderParam, setOrderParam] = useState(available_filter_attributes[entity][0].value)
    const [isOrderDescending, setIsOrderDescending] = useState(false)

    const [showDeletionAlert, setShowDeletionAlert] = useState(false)
    const [deletionId, setDeletionId] = useState()

    const decrement = () => {
        setIsForward(false)
        setPage(page - 1)
    }
    const increment = () => {
        setIsForward(true)
        setPage(page + 1)
    }

    const onDeleteHandler = (id) => {
        setShowDeletionAlert(true)
        setDeletionId(id)
    }

    const closeDeletion = (isDeleted) => {
        setShowDeletionAlert(false)
        setDeletionId(null)
        if (isDeleted) {
            init.current = true
            if (page === 1) {
                setUpdateTrigger(!updateTrigger)
            } else {
                setPage(1)
            }
        }
    }

    const changeOrder = (newOrderParam) => {
        if (orderParam === newOrderParam) {
            setIsOrderDescending(!isOrderDescending)
        }
        else {
            setOrderParam(newOrderParam)
            setIsOrderDescending(false)
        }
        init.current = true
        if (page === 1) {
            setUpdateTrigger(!updateTrigger)
        }
        else {
            setPage(1)
        }
    }

    const searchHandler = () => {
        setBlockIncrement(false)
        init.current = true
        setSearch(searchValue !== "")
        if (page === 1) {
            setUpdateTrigger(!updateTrigger)
        }
        else {
            setPage(1)
        }
    }

    const clearHandler = () => {
        setSearchValue("")
        setSearch(false)
        searchHandler()
    }

    useEffect(() => {
        const getData = async (p) => {
            let result = {success: false, data: null}
            let url = "/" + entity + "/read-objects?limit=10&offset=" + (p - 1) * 10 + "&order_by=" + orderParam + "&descending=" + isOrderDescending
            if (search) {
                url += "&filter_field=" + searchParam + "&filter_value=" + searchValue
                console.log(url)
            }
            if (entity === "game") {
                await instance.post(url)
                    .then((response) => response.data)
                    .then((actualData) => {
                        result.success = true
                        result.data = actualData;
                    })
                    .catch((err) => {
                        result.success = false
                        result.data = err.message
                    })
            }
            else {
                await instance.get(url)
                    .then((response) => response.data)
                    .then((actualData) => {
                        result.success = true
                        result.data = actualData;
                    })
                    .catch((err) => {
                        result.success = false
                        result.data = err.message
                    })
            }
            return result
        }

        const updateData = async () => {
            setLoading(true)
            if (init.current) {
                await getData(page).then((res) => res.success ? setData(res.data) : setError(res.data))
                await getData(page + 1).then((res) =>
                    res.success ? res.data.length === 0 ? setBlockIncrement(true) : setNextData(res.data) : setError(res.data)
                )
                init.current = false
            }
            else {
                if (isForward) {
                    setPrevData(data)
                    setData(nextData)
                    await getData(page + 1)
                        .then((res) =>
                            res.success ? res.data.length === 0 ? setBlockIncrement(true) : setNextData(res.data) : setError(res.data)
                        )
                }
                else {
                    setBlockIncrement(false)
                    setNextData(data)
                    setData(prevData)
                    if (page !== 1) {
                        await getData(page - 1).then((res) => res.success ? setPrevData(res.data) : setError(res.data))
                    }
                }
            }
            setLoading(false)
        }

        updateData()
    }, [page, updateTrigger])

    return (
        <>
            <div>
                {loading && <div>A moment please...</div>}
                {error && (
                    <div>{`There is a problem fetching the post data - ${error}`}</div>
                )}
                <div className="d-flex align-items-center justify-content-center mb-3">
                    <div className="input-group w-25">
                        <span className="input-group-text">Поиск по</span>
                        <Select
                            options={available_filter_attributes[entity]}
                            classNamePrefix="search_parameter"
                            defaultValue={available_filter_attributes[entity][0]}
                            isSearchable={true}
                            name="search_parameter"
                            onChange={(val) => setSearchParam(val.value)}
                            classNames={{
                                container: (state) => "form-control p-0",
                                control: (state) => "bg-body text-reset border-0",
                                option: (state) => "bg-body text-reset",
                                menu: (state) => "bg-body text-reset",
                                singleValue: (state) => "bg-body text-reset",
                                input: (state) => "text-white",
                            }}
                            isClearable={false}
                            placeholder={"Выбрать..."}
                        />
                        <input type="text" aria-label="Search" className="form-control" value={searchValue} onInput={e => setSearchValue(e.target.value)}/>
                        <button className="btn btn-outline-secondary" type="button" onClick={clearHandler}>
                            <i className="fa fa-close"></i>
                        </button>
                        <button className="btn btn-outline-secondary" type="button" onClick={searchHandler}>
                            <i className="fa fa-search"></i>
                        </button>
                    </div>
                </div>
                <div className="overflow-y-auto overflow-x-auto w-auto" style={{height: "80vh"}}>
                    {!loading && !error &&
                        <ObjectsTable
                            objects={data} enableEditor={enableEditor} entity={entity}
                            orderParam={orderParam} isOrderDescending={isOrderDescending} changeOrder={changeOrder}
                            orderFields={available_filter_attributes[entity].map((object) => object.value)}
                            onDeleteHandler={onDeleteHandler}
                        />
                    }
                </div>
                <div className="d-flex align-items-center justify-content-center">
                    <PageControl page={page} decrement={decrement} increment={increment} blockIncrement={blockIncrement}/>
                </div>
            </div>
            {showDeletionAlert && <DeletionAlert entity={entity} id={deletionId} close={closeDeletion}/>}
        </>
    );
};

export default ObjectsList;