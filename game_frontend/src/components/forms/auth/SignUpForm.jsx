import { Input } from '../../index'
import { FormProvider, useForm } from 'react-hook-form'
import {
    login_validation,
    desc_validation,
    email_validation,
    num_validation,
    password_validation, new_login_validation, new_password_validation, confirm_password_validation, date_picker,
} from '../../../utils/inputValidations'
import React, { useState } from 'react'
import { GrMail } from 'react-icons/gr'
import { BsFillCheckSquareFill } from 'react-icons/bs'
import {instance} from "../../../api.config";

export const SignUpForm = () => {
    const methods = useForm()
    const [success, setSuccess] = useState(false)
    const [confirmFailed, setConfirmFailed] = useState(false)
    const [load, setLoad] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState("")

    const onSubmit = methods.handleSubmit(data => {
        setSent(false)
        if (data.new_password === data.confirm_password) {
            setConfirmFailed(false)
            setLoad(true)
            instance.post("/auth/sign-up", {
                login: data.login,
                email: data.email,
                password: data.new_password,
                birth_date: data.birth_date,
            }, {withCredentials: true}
            ).then((e) => {
                setSuccess(true)
                methods.reset()
            }).catch((err) => {
                const code = err.request.status
                if (code === 400) {
                    if (err.response.data.detail === "Email already registered") {
                        setError("Email уже занят")
                    }
                    if (err.response.data.detail === "Login already registered") {
                        setError("Логин уже занят")
                    }
                }
                else {
                    setError("Во время регистрации произошла ошибка")
                }
                setSuccess(false)
            }).finally((e) => {
                setSent(true)
                setLoad(false)
            })
        }
        else {
            setConfirmFailed(true)
        }
    })
    return (
        <FormProvider {...methods}>
            <form
                onSubmit={e => e.preventDefault()}
                noValidate
                autoComplete="off"
                className="container"
            >
                <div className="container mt-5 text-center">
                    <div className="grid gap-5 md:grid-cols-2">
                        <p className="text-start">Логин не должен содержать символа @</p>
                        <Input {...new_login_validation}/>
                        <Input {...email_validation}/>
                        <p className="text-start">Минимум 8 символов, 1 служебный символ и 1 цифра, по 1 заглавной и строчной букве</p>
                        <Input {...new_password_validation}/>
                        <Input {...confirm_password_validation}/>
                        <Input {...date_picker("birth_date")}/>
                    </div>
                </div>
                <div className="container mt-5">
                    {load && <p>Загрузка...</p>}
                    {sent && success && (
                        <div className="mt-5">
                            <div className="alert alert-success" role="alert">
                                <h4 className="alert-heading">Регистрация успешна!</h4>
                                <p>
                                    Ваша учетная запись была успешно создана. Теперь вы можете войти, используя свои
                                    учетные данные.
                                </p>
                            </div>
                        </div>
                    )}
                    {sent && !success && (
                        <div className="mt-5">
                            <div className="alert alert-danger" role="alert">
                                <h4 className="alert-heading">Ошибка во время регистрации!</h4>
                                <p>
                                    {error}
                                </p>
                            </div>
                        </div>
                    )}
                    {confirmFailed && (
                        <div className="mt-5">
                            <div className="alert alert-danger" role="alert">
                                <h4 className="alert-heading">Пароли не совпадают!</h4>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={onSubmit}
                        type="button"
                        className="btn btn-primary"
                    >
                        Зарегистрироваться
                    </button>
                </div>
            </form>
        </FormProvider>
    )
}
