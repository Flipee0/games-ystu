import React, {useCallback, useRef, useState} from 'react';
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImage"

const ImageEditor = ({ src, config, setCroppedImageParam, close }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, [])

    const onCrop = async () => {
        const cropped_image_url = await getCroppedImg(src, croppedAreaPixels)
        setCroppedImageParam(cropped_image_url)
    }

    return (
        <>
        <Cropper
                cropShape={config.cropShape}
                image={src}
                crop={crop}
                zoom={zoom}
                aspect={config.aspectRatio}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                zoomSpeed={0.05}
                classes={{containerClassName: "z-2"}}
            />
            <div className="col-md-3 d-grid gap-2 d-md-block z-3 position-absolute bottom-0 start-50 mb-2 translate-middle">
                <button type="button" className="btn btn-primary btn-block col-5 me-2" onClick={onCrop}>Сохранить</button>
                <button type="button" className="btn btn-danger btn-block col-5" onClick={close}>Отменить</button>
            </div>
        </>
    )
};

export default ImageEditor;