import React, {useEffect, useState} from 'react';
import Select from "react-select";
import {available_filter_attributes} from "../FIlterFields";
import {instance} from "../../api.config";
import {AnimatePresence, motion} from "framer-motion";
import SelectFilter from "./SelectFilter";

const GameSearch = ({searchHandler}) => {
    const [searchParam, setSearchParam] = useState("id")
    const [searchValue, setSearchValue] = useState("")

    const [filtersIsOpen, setFiltersIsOpen] = useState(false)

    const [series, setSeries] = useState(null)
    const [genres, setGenres] = useState(false)
    const [platforms, setPlatforms] = useState(false)
    const [companies, setCompanies] = useState(false)
    const [locales, setLocales] = useState(false)

    const [filterSeries, setFilterSeries] = useState(null)
    const [filterGenres, setFilterGenres] = useState([])
    const [filterPlatforms, setFilterPlatforms] = useState([])
    const [filterDevelopers, setFilterDevelopers] = useState([])
    const [filterDistributors, setFilterDistributors] = useState([])
    const [filterLocales, setFilterLocales] = useState([])


    useEffect(() => {
        instance.get("/series/read-objects").then((data) => {
            setSeries(data.data.map((series) => ({value: series.id, label: series.name})))
        })
        instance.get("/genre/read-objects").then((data) => {
            setGenres(data.data.map((genre) => ({value: genre.id, label: genre.name})))
        })
        instance.get("/platform/read-objects").then((data) => {
            setPlatforms(data.data.map((platform) => ({value: platform.id, label: platform.name})))
        })
        instance.get("/company/read-objects").then((data) => {
            setCompanies(data.data.map((company) => ({value: company.id, label: company.name})))
        })
        instance.get("/locale/read-objects").then((data) => {
            setLocales(data.data.map((locale) => ({value: locale.id, label: locale.language})))
        })
    }, [])

    const clearHandler = () => {
        setSearchValue("")
        searchHandler(null)
    }

    return (
        <div className="row rounded shadow p-3">
            <div className="col-md-12">
                <div className="input-group">
                    <span className="input-group-text">Поиск по</span>
                    <Select
                        options={available_filter_attributes.game}
                        classNamePrefix="search_parameter"
                        defaultValue={available_filter_attributes.game}
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
                        <i className="fa fa-eraser"></i>
                    </button>
                    <button className="btn btn-outline-secondary" type="button" onClick={
                        () => searchHandler(
                            {
                                searchParam: searchParam,
                                searchValue: searchValue,
                                filterGenres: filterGenres,
                                filterPlatforms: filterPlatforms,
                                filterLocales: filterLocales,
                                filterDevelopers: filterDevelopers,
                                filterDistributors: filterDistributors,
                            }
                        )
                    }>
                        <i className="fa fa-search"></i>
                    </button>
                    <button className="btn btn-outline-secondary" onClick={() => setFiltersIsOpen(!filtersIsOpen)}>
                        <i className={"fa " + (filtersIsOpen ? "fa-close" : "fa-sliders")}></i>
                    </button>
                </div>
            </div>
            <AnimatePresence mode="wait">
                {filtersIsOpen &&
                    <motion.div
                        animate={{ scaleX: 1 }}
                        initial={{ scaleX: 0 }}
                        exit={{ scaleX: 0 }}
                    >
                        <div className="row mb-1">
                            <div className="col-md-12">
                                <Select
                                    options={series}
                                    classNamePrefix="series_filter"
                                    isSearchable={true}
                                    name="series_filter"
                                    onChange={(val) => val == null ? setFilterSeries(null) : setFilterSeries(val.value)}
                                    classNames={{
                                        container: (state) => "form-control p-0",
                                        control: (state) => "bg-body text-reset border-0",
                                        option: (state) => "bg-body text-reset",
                                        menu: (state) => "bg-body text-reset",
                                        singleValue: (state) => "bg-body text-reset",
                                        input: (state) => "text-white",
                                    }}
                                    isClearable={true}
                                    placeholder="Выберите серию игр"
                                />
                            </div>
                        </div>
                        <SelectFilter name="genres_filter" options={genres} placeholder="Выберите жанры" onChange={setFilterGenres}/>
                        <SelectFilter name="platforms_filter" options={platforms} placeholder="Выберите платформы" onChange={setFilterPlatforms}/>
                        <SelectFilter name="locales_filter" options={locales} placeholder="Выберите локализации" onChange={setFilterLocales}/>
                        <SelectFilter name="developers_filter" options={companies} placeholder="Выберите разработчиков" onChange={setFilterDevelopers}/>
                        <SelectFilter name="distributors_filter" options={companies} placeholder="Выберите издателей" onChange={setFilterDistributors}/>
                    </motion.div>
                }
            </AnimatePresence>
        </div>
    );
};

export default GameSearch;