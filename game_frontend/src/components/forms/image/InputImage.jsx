import React, {useEffect, useRef, useState} from 'react';
import {AnimatePresence, motion} from "framer-motion";
import ImageEditor from "./ImageEditor";
import {Input} from "../../Input";
import {image as image_props} from "../../../utils/inputValidations";
import {InputImageField} from "./InputImageField";
import {InputError} from "../../InputError";
import {findInputError, isFormInvalid} from "../../../utils";
import {getImage} from "../../../utils/GetImage";
import {translate} from "../../../langConfig";

const types_config = {
    logo: {
        aspectRatio: 16 / 9,
        cropShape: "rect"
    },
    avatar: {
        aspectRatio: 1,
        cropShape: "round"
    },
}

const InputImage = ({ name, methods, required, type, defaultValue }) => {
    const [drag, setDrag] = useState(false)
    const [scale, setScale] = useState(1.0)
    const [error, setError] = useState()
    const [image, setImage] = useState()
    const [croppedImage, setCroppedImage] = useState("")

    const [inputError, setInputError] = useState()
    const [isInvalid, setIsInvalid] = useState()

    const [load, setLoad] = useState(true)

    useEffect(() => {
        if (defaultValue != null) {
            setLoad(true)
            getImage(defaultValue).then((value) =>
            {
                setCroppedImage(value)
                methods.setValue(type + "__" + name, "current__" + defaultValue)
            })
            setLoad(false)
        }
    }, [])

    const updateError = (inputErrorParam, isInvalidParam) => {
        setInputError(inputErrorParam)
        setIsInvalid(isInvalidParam)
    }

    const setCroppedImageParam = (cropped_image_url) => {
        setCroppedImage(cropped_image_url)
        methods.setValue(type + "__" + name, cropped_image_url)
    }

    const clearFile = () => {
        setImage(null)
        setCroppedImage("")
        methods.setValue(type + "__" + name, "")
    }

    function dragStartHandler(e) {
        e.preventDefault()
        setDrag(true)
        setScale(1.1)
    }

    function dragLeaveHandler(e) {
        e.preventDefault()
        setDrag(false)
        setScale(1.0)
    }

    function onDropHandler(e) {
        e.preventDefault()
        setScale(1.0)
        let files = [...e.dataTransfer.files]
        if (files.length === 1) {
            if (["jpg", "jpeg", "png"].includes(files[0].name.split(".")[1])) {
                if (files[0].size <= 1024 * 1024 * 4) {
                    setError(null)
                    setImage(URL.createObjectURL(files[0]))
                }
                else {
                    setError("Размер файла превышает допустимое значение (4 мб)")
                }
            }
            else {
                setError("Файл имеет недопустимое расширение (.jpg, .jpeg, .png)")
            }
        }
        else {
            setError("Выберите один файл")
        }
        setDrag(false)
    }

    return (
        <>
            <div className="d-flex align-items-center justify-content-center">
                <div className="col-md-12 input-group w-75">
                    {croppedImage === "" ?
                        <span className="input-group-text w-100">{translate.field[name].i}:</span>
                    :
                        <>
                            <span className="input-group-text w-75">Логотип:</span>
                            <button className="btn btn-outline-danger w-25" type="button" onClick={clearFile}>Очистить изображение</button>
                        </>
                    }
                </div>
            </div>
            {croppedImage === "" ?
                image == null ?
                    <>
                        <div style={{height: "15em"}} className="d-flex align-items-center justify-content-center">
                            <motion.div
                                className="w-75 h-100 d-flex align-items-center justify-content-center border rounded shadow"
                                animate={{ scale: scale }}
                                onDragStart={e => dragStartHandler(e)}
                                onDragLeave={e => dragLeaveHandler(e)}
                                onDragOver={e => dragStartHandler(e)}
                                onDrop={e => onDropHandler(e)}
                            >
                                <h3>{drag ? "Отпустите файл, чтобы загрузить его" : "Перетащите файл, чтобы загрузить его"}</h3>
                            </motion.div>
                        </div>
                        <div className="d-flex align-items-center justify-content-center">
                            {error != null && <div className="alert alert-danger w-75" role="alert">
                                {error}
                            </div>}
                        </div>
                    </>
                    :
                    <ImageEditor src={image} config={types_config[type]} setCroppedImageParam={setCroppedImageParam} close={clearFile}/>
                :
                <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                    <img className="w-75 h-100 border rounded shadow" src={croppedImage}/>
                </div>
            }
            <InputImageField name={type + "__" + name} required={required} updateError={updateError}/>
            <div className="d-flex align-items-center justify-content-center">
                <div className="w-75">
                    <AnimatePresence mode="wait" initial={false}>
                        {isInvalid && (
                            <InputError
                                message={inputError.error.message}
                                key={inputError.error.message}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </>
    )
};

export default InputImage;