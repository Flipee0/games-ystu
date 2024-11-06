import React, {useEffect, useState} from 'react';
import AuthStore from "../../store";
import {instance} from "../../api.config";
import {AnimatePresence, motion} from "framer-motion";
import {InputError} from "../InputError";
import EditProfile from "./EditProfile";
import {getImage} from "../../utils/GetImage";

const Profile = () => {
    const [error, setError] = useState(true)
    const [loadInfo, setLoadInfo] = useState(true)
    const [image, setImage] = useState(true)
    const [data, setData] = useState()
    const [edit, setEdit] = useState(false)

    useEffect(() => {
        setLoadInfo(true)
        instance.get("/user/me").then((res) => {
            setData(res.data)
            setError(false)
            getImage(res.data.avatar).then((res) => {
                setImage(res)
            })
        }).catch((err) => {
            setError(true)
        }).finally(() =>
            setLoadInfo(false)
        )
    }, [])

    const editHandler = () => {
        setEdit(!edit)
    }

    return (
        <div className="d-flex justify-content-center">
                <div className="col-md-6 shadow">
                {loadInfo &&
                    <p>Загрузка...</p>
                }
                {!loadInfo && error &&
                    <p>При загрузке данных произошла ошибка</p>
                }
                {!loadInfo && !error &&
                    <>
                        <div className="row">
                            <div className="col-md-4">
                                <img src={image} className="rounded-circle"/>
                            </div>
                            <div className="col-md-8">
                                <h2>{data.login}</h2>
                                <p>{data.role.name}</p>
                                <p>Email: {data.email}</p>
                                <p>Дата регистрации: {new Date(data.registration_date).toLocaleString("ru-RU", {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric'
                                })}</p>
                                <p>Дата рождения: {new Date(data.birth_date).toLocaleDateString("ru-RU", {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}</p>
                            </div>
                        </div>
                        <button className="btn btn-primary" onClick={editHandler}>{edit ? "Отменить" : "Редактировать профиль"}</button>
                        <AnimatePresence mode="wait">
                            {edit &&
                                <motion.div
                                    animate={{ scaleX: 1 }}
                                    initial={{ scaleX: 0 }}
                                    exit={{ scaleX: 0 }}
                                >
                                    <EditProfile data={data}/>
                                </motion.div>
                            }
                        </AnimatePresence>
                    </>
                }
            </div>
        </div>
    );
};

export default Profile;