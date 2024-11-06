import {instance} from "../api.config";

export const getImage = async (path) => {
    let file = null
    if (path == null) {
        return null
    }
    await instance.get("/image/get?file_path=" + path, {responseType: 'blob'})
        .then((response) => response.data)
        .then((actualData) => {
            file = URL.createObjectURL(actualData)
        })
        .catch((err) => {
            file = null
        })

    return file
}