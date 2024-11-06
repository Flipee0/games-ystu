import cn from 'classnames'
import { useFormContext } from 'react-hook-form'
import { AnimatePresence, motion } from 'framer-motion'
import { MdError } from 'react-icons/md'
import {findInputError, isFormInvalid} from "../../../utils";
import {InputError} from "../../InputError";
import {useEffect, useState} from "react";

export const InputImageField = ({ name, required, reference, updateError }) => {
    const {
        register,
        formState: { errors },
    } = useFormContext()

    useEffect(() => {
        const inputError = findInputError(errors, name)
        const isInvalid = isFormInvalid(inputError)
        updateError(inputError, isInvalid)
    }, [errors])

    return (
        <div className="form-floating mb-3 position-absolute invisible">
            <input
                ref={reference}
                type="text"
                className="form-control"
                id={name}
                placeholder=""
                {...register(name, {required: required ? "Обязательно для заполнения" : false})}
            />
        </div>
  )
}


