import cn from 'classnames'
import { findInputError, isFormInvalid } from '../utils'
import { useFormContext } from 'react-hook-form'
import { AnimatePresence, motion } from 'framer-motion'
import { MdError } from 'react-icons/md'
import {InputError} from "./InputError";
import {translate} from "../langConfig";

export const Input = ({ multiline, type, id, validation, name, value, defaultValue, invisible, ref }) => {
    const {
        register,
        formState: { errors },
    } = useFormContext()
    const inputError = findInputError(errors, name)
    const isInvalid = isFormInvalid(inputError)

    return (
        <div className={"form-floating mb-3" + (invisible ? " position-absolute" : "")}>
            {multiline ?
                <textarea
                    ref={ref}
                    type={type}
                    className="form-control"
                    id={id}
                    placeholder=""
                    {...register(name, validation)}
                    value={value}
                    defaultValue={defaultValue}
                    style={{whiteSpace: "pre-line"}}
                ></textarea>
                :
                <input
                    ref={ref}
                    type={type}
                    className="form-control"
                    id={id}
                    placeholder=""
                    {...register(name, validation)}
                    value={value}
                    defaultValue={defaultValue}
                />
            }
            <label htmlFor={id}>{translate.field[name].i}</label>
            <AnimatePresence mode="wait" initial={false}>
                {isInvalid && (
                    <InputError
                        message={inputError.error.message}
                        key={inputError.error.message}
                    />
                )}
            </AnimatePresence>
        </div>
  )
}


