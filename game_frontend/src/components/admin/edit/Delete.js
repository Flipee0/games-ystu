import {instance} from "../../../api.config";

export const deleteObject = async (entity, id) => {
    let success = false
    await instance.post("/" + entity + "/delete?object_id=" + id)
        .then((e) => success = true)
        .catch((err) => success = false)
    return success
}