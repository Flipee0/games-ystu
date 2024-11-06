import {instance} from "../../../../api.config";

export const submitForm = async (data, entity, operation, id) => {
    for (let key in data) {
        if (typeof data[key] === 'string' || data[key] instanceof String) {
            if (data[key].startsWith("blob:")) {
                const [type, name] = key.split("__")
                let blob = await fetch(data[key]).then(r => r.blob());
                const myFile = new File([blob], 'image', {
                    type: blob.type,
                });

                const formData = new FormData()
                formData.set("file", myFile)

                await instance.post("/image/upload/" + type, formData)
                    .then((response) => response.data)
                    .then((actualData) => {
                        data[name] = actualData
                    })
                delete data[key]
            }
            else if (data[key].startsWith("current__")) {
                const [type, name] = key.split("__")
                data[name] = data[key].split("__")[1]
                delete data[key]
            }
        }
    }
    let status = null
    let url = "/" + entity + "/" + operation
    if (operation === "update") {
        url += "?object_id=" + id
    }
    await instance.post(url, data)
        .then((response) => status = response.request.status)
        .catch((reason) => {status = reason.request.status})
    let result = {
        success: false,
        message: "Произошла ошибка"
    }
    if (status === 200) {
        result.success = true
        result.message = "Данные успешно отправлены!"
    }
    else if (status === 400) {
        result.success = false
        result.message = "Ошибка 400: плохой запрос, проверьте правильность введенных данных"
    }
    else if (status === 401) {
        result.success = false
        result.message = "Ошибка 401: пользователь не авторизован"
    }
    else if (status === 403) {
        result.success = false
        result.message = "Ошибка 403: доступ запрещен (недостаточно прав)"
    }
    else if (status === 422) {
        result.success = false
        result.message = "Ошибка 422: проверьте правильность введенных данных"
    }
    else {
        result.success = false
        result.message = `Ошибка ${status}`
    }

    return result
}