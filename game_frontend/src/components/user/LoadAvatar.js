import {instance} from "../../api.config";

export const loadAvatar = async (data) => {
    let result = null
    if (data.startsWith("blob:")) {
        let blob = await fetch(data).then(r => r.blob());
        const myFile = new File([blob], 'image', {
            type: blob.type,
        });

        const formData = new FormData()
        formData.set("file", myFile)

        await instance.post("/image/upload/avatar", formData)
            .then((response) => response.data)
            .then((actualData) => {
                result = actualData
            })
    } else if (data.startsWith("current__")) {
        result = data.split("__")[1]
    }
    return result
}