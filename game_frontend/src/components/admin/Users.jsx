import React, {useEffect, useState} from 'react';
import {instance} from "../../api.config";
import UserElement from "./UserElement";
import Select from "react-select";
import {available_filter_attributes} from "../FIlterFields";

const Users = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [users, setUsers] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const [fetching, setFetching] = useState(true)
    const [forceUpdate, setForceUpdate] = useState(true)
    const [loadAll, setLoadAll] = useState(false)

    const [search, setSearch] = useState("")
    const [searchRole, setSearchRole] = useState(null)

    const rolesOptions = [
        {value: "Администратор", label: "Администратор"},
        {value: "Модератор", label: "Модератор"},
        {value: "Пользователь", label: "Пользователь"}
    ]

    const scrollHandler = (e) => {
        if (e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 300) {
            setFetching(true)
        }
    }

    const searchHandler = () => {
        setUsers([])
        setLoadAll(false)
        setCurrentPage(0)
        if (fetching) {
            setForceUpdate(!forceUpdate)
        }
        else {
            setFetching(true)
        }
    }

    const closeHandler = () => {
        setSearch("")
        setSearchRole(null)
        searchHandler()
    }

    useEffect(() => {
        setLoading(true)
        if (fetching && !loadAll) {
            let url = "/user/get-users?limit=10&offset=" + 10 * currentPage
            if (search !== "") {
                url += "&login=" + search
            }
            if (searchRole != null) {
                url += "&role=" + searchRole
            }
            instance.get(url)
                .then((response) => response.data)
                .then((actualData) => {
                    if (actualData.length === 0) {
                        setLoadAll(true)
                    }
                    setUsers([...users, ...actualData])
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

    const grantHandler = (id, role) => {
        const newRole = role === "Модератор" ? "Пользователь" : "Модератор"
        instance.post(`/user/grant-role?user_id=${id}&role_name=${newRole}`).then(() => {
            setUsers(users.map(c => {
                if (c.id === id) {
                    c.role = newRole
                }
                return c
            }))
        })
    }

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="input-group">
                        <span className="input-group-text">Имя пользователя:</span>
                        <input type="text" aria-label="Search" className="form-control" value={search} onInput={(event) => setSearch(event.target.value)}/>
                        <Select
                            options={rolesOptions}
                            classNamePrefix="search_role"
                            defaultValue={null}
                            isSearchable={true}
                            name="search_role"
                            value={searchRole == null ? null : rolesOptions.find(c => c.value === searchRole)}
                            onChange={(val) => val == null ? setSearchRole(null) : setSearchRole(val.value)}
                            classNames={{
                                container: (state) => "form-control p-0",
                                control: (state) => "bg-body text-reset border-0",
                                option: (state) => "bg-body text-reset",
                                menu: (state) => "bg-body text-reset",
                                singleValue: (state) => "bg-body text-reset",
                                input: (state) => "text-white",
                            }}
                            isClearable={true}
                            placeholder={"Роль"}
                        />
                        <button type="button" className="btn btn-outline-secondary" onClick={searchHandler}><i className="fa fa-search"></i></button>
                        <button type="button" className="btn btn-outline-secondary" onClick={closeHandler}><i className="fa fa-close"></i></button>
                    </div>
                </div>
            </div>
            {users.map((user) => <UserElement data={user} grantHandler={grantHandler}/>)}
        </div>
    );
};

export default Users;