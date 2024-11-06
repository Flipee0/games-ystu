import { Input } from '../../index'
import { FormProvider, useForm } from 'react-hook-form'
import {
  login_validation,
  desc_validation,
  email_validation,
  num_validation,
  password_validation,
} from '../../../utils/inputValidations'
import authStore from "../../../store.js";
import {motion} from "framer-motion";
import React, {useState} from "react";
import {observer} from "mobx-react-lite";
import {observe} from "mobx";
import SignInError from "./SignInError";


export const SignInForm = (props) => {
    const methods = useForm()

    const onSubmit = methods.handleSubmit(data => {
        authStore.login(data.username, data.password)
    })
    return (
        <>
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                    ease: "easeIn",
                    damping: 3
                }}
                className="modal show"
                style={{ display: 'block' }}
                tabIndex="-1"
            >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Вход</h5>
                                <button type="button" className="btn-close" onClick={() => props.toggle()}></button>
                            </div>
                            <div className="modal-body">
                                <FormProvider {...methods}>
                                    <form
                                        onSubmit={e => e.preventDefault()}
                                        noValidate
                                        autoComplete="off"
                                        className="container"
                                    >
                                        <div className="container mt-5 text-center">
                                            <div className="grid gap-5 md:grid-cols-2">
                                                <Input {...login_validation}/>
                                                <Input {...password_validation}/>
                                                <SignInError/>
                                            </div>
                                        </div>
                                        <div className="container mt-5">
                                            <button
                                                onClick={onSubmit}
                                                type="button"
                                                className="btn btn-primary"
                                            >
                                                Войти
                                            </button>
                                        </div>
                                    </form>
                                </FormProvider>
                            </div>
                        </div>
                    </div>
            </motion.div>
        </>
    )
}