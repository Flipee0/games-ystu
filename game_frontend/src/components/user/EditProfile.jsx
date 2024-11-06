import React, {useState} from 'react';
import {Input} from "../Input";
import {date_picker, email_validation, new_login_validation, textarea} from "../../utils/inputValidations";
import {FormProvider, useForm} from "react-hook-form";
import {instance} from "../../api.config";
import InputImage from "../forms/image/InputImage";
import {loadAvatar} from "./LoadAvatar";

const EditProfile = ({data}) => {
    const methods = useForm()
    const [load, setLoad] = useState(false)
    const [isSent, setIsSent] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)

    const onSubmit = methods.handleSubmit(data => {
        const loadData = async (upladedData) => {
            let avatar = null
            if (upladedData.avatar__avatar != null) {
                avatar = await loadAvatar(upladedData.avatar__avatar)
            }
            const result = {success: false, message: null}
            await instance.post("/user/update", {
                login: upladedData.login,
                email: upladedData.email,
                avatar: avatar,
                birth_date: upladedData.birth_date
            }).then((e) => {
                result.success = true
            }).catch((err) => {
                result.success = false
                const code = err.request.status
                if (code === 400) {
                    if (err.response.data.detail === "Email already registered") {
                        result.message = "Email уже занят"
                    }
                    if (err.response.data.detail === "Login already registered") {
                        result.message = "Логин уже занят"
                    }
                }
                else {
                    result.message = "Во время обновления данных произошла ошибка"
                }
            })
            return result
        }

        setLoad(true)
        loadData(data)
            .then((res) => {
                if(res.success) {
                    setSuccess(true)
                    setError(false)
                    window.location.reload()
                }
                else {
                    setError(res.message)
                    setSuccess(false)
                }
            })
            .finally(() => {
                setIsSent(true)
                setLoad(false)
            })
    })

    return (
        <div>
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
                                    <Input {...new_login_validation} defaultValue={data.login}/>
                                    <Input {...email_validation} defaultValue={data.email}/>
                                    <Input {...date_picker("birth_date")} defaultValue={data.birth_date}/>
                                    <InputImage name="avatar" methods={methods} required={false} type="avatar" defaultValue={data.avatar}/>
                                </div>
                            </div>
                            <div className="container mt-5">
                                <button
                                    onClick={onSubmit}
                                    type="button"
                                    className={"btn btn-primary" + (load ? " disabled" : "")}
                                >
                                    Применить
                                </button>
                            </div>
                        </form>
                    </FormProvider>
                </div>
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
        </div>
    );
};

export default EditProfile;