import {Controller, FormProvider, useForm} from 'react-hook-form'
import {useEffect, useState} from 'react'
import {submitForm} from "./submitForm";
import {getInputFields} from "./formsConfig";
import {instance} from "../../../../api.config";
import {useParams} from "react-router-dom";
import {translate} from "../../../../langConfig";

export const FormBase = ({ entity, operation }) => {
    const methods = useForm()
    const params = useParams();

    const [isSent, setIsSent] = useState(false)
    const [success, setSuccess]= useState(false)
    const [message, setMessage]= useState(false)
    const [containsData, _]= useState(operation === 'update')

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (containsData) {
            const id = params.id;
            instance.get("/" + entity + "/read-object?object_id=" + id)
                .then((response) => response.data)
                .then((actualData) => {
                    setData(actualData);
                    setError(null);
                })
                .catch((err) => {
                    setError(err.message);
                    setData(null);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
        else {
            setError(false)
            setLoading(false)
        }
    }, [])

    const onSubmit = methods.handleSubmit(async data => {
        const response_result = await submitForm(data, entity, operation, params.id)
        setIsSent(true)
        setSuccess(response_result.success)
        setMessage(response_result.message)
    })
    return (
        <>
            {loading && <div>A moment please...</div>}
            {error && (
                <div>{`There is a problem fetching the post data - ${error}`}</div>
            )}
            {!loading && !error &&
                <FormProvider {...methods}>
                    <form
                        onSubmit={e => {e.preventDefault()}}
                        noValidate
                        autoComplete="off"
                        className="container"
                    >
                        <div className="container mt-5 text-center">
                            <div className="grid gap-5 md:grid-cols-2">
                                {getInputFields(entity, methods, data)}
                            </div>
                        </div>
                        <div className="container mt-5">
                            {isSent && (
                                <div className="mt-5">
                                    <div className={"alert " + (success ? "alert-success" : "alert-danger")} role="alert">
                                        <h4 className="alert-heading">{message}</h4>
                                        {success &&
                                            <p className="mb-0">
                                                <a href={"/admin/show/" + entity} className="btn btn-primary">Назад</a>
                                            </p>}
                                    </div>
                                </div>
                            )}
                            <button
                                onClick={onSubmit}
                                type="button"
                                className="btn btn-primary"
                            >
                                {operation === "create" ? "Добавить" : "Применить изменения"}
                            </button>
                        </div>
                    </form>
                </FormProvider>
            }
        </>
    )
}
