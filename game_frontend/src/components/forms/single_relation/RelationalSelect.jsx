import React from 'react';
import Select from 'react-select'
import {Controller} from "react-hook-form";
import {findInputError, isFormInvalid} from "../../../utils";
import {AnimatePresence} from "framer-motion";
import {InputError} from "../../InputError";
import * as inputError from "react-dom/test-utils";

const RelationalSelect = ({ name, data, multi, required, control, defaultValue}) => {
    return (
        <div>
            <Controller
                rules={{required : required ? "Обязательно для заполнения" : false}}
                control={control}
                name={name}
                defaultValue={defaultValue}
                render={({ field  , formState}) => (
                    <>
                        <Select
                            classNamePrefix={name}
                            defaultValue={defaultValue ? multi ? data.filter(c => defaultValue.includes(c.value)) : defaultValue : null}
                            value={data.find(c => c.value === field.value)}
                            onChange={val => field.onChange(val == null ? "" : multi ? val.map((elem) => elem.value) : val.value)}
                            options={data}
                            isMulti={multi}
                            isSearchable={true}
                            name={name}
                            classNames={{
                                control: (state) => "bg-body text-reset",
                                option: (state) => "bg-body text-reset",
                                menu: (state) => "bg-body text-reset",
                                singleValue: (state) => "bg-body text-reset",
                                multiValue: (state) => "bg-body text-reset",
                                multiValueLabel: (state) => "bg-body text-reset",
                                multiValueRemove: (state) => "bg-body text-reset",
                                input: (state) => "text-white",
                            }}
                            isClearable={!required}
                            placeholder={"Выбрать..."}
                        />
                        <AnimatePresence mode="wait" initial={false}>
                            {isFormInvalid(findInputError(formState.errors, name)) && (
                                <InputError
                                    message={findInputError(formState.errors, name).error.message}
                                    key={findInputError(formState.errors, name).error.message}
                                />
                            )}
                        </AnimatePresence>
                    </>
                )}
            />
        </div>
    );
};

export default RelationalSelect;