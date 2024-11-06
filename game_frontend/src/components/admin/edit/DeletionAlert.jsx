import React, {useState} from 'react';
import {translate} from "../../../langConfig";
import {deleteObject} from "./Delete";

const DeletionAlert = ({entity, id, close}) => {
    const [deleteConfirmed, setDeleteConfirmed] = useState(false)
    const [deletionSuccessful, setDeletionSuccessful] = useState()
    const [load, setLoad] = useState(false)

    const deleteHandler = () => {
        setDeleteConfirmed(true)
        setLoad(true)
        deleteObject(entity, id).then((res) => {
            setDeletionSuccessful(res)
            setLoad(false)
        })
    }

    return (
        <div className="modal show d-block" tabIndex="-1">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Подтверждение удаления</h5>
                </div>
                <div className="modal-body">
                    {!deleteConfirmed &&
                        <p>Вы действительно хотите удалить {translate.entity[entity].v} с идентификатором {id}?</p>
                    }
                    {deleteConfirmed && load &&
                        <p>Загрузка...</p>
                    }
                    {deleteConfirmed && !load && deletionSuccessful &&
                        <p>Успешное удаление</p>
                    }
                    {deleteConfirmed && !load && !deletionSuccessful &&
                        <p>При удалении произошла ошибка</p>
                    }
                </div>
                <div className="modal-footer">
                    {!deleteConfirmed &&
                        <>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => close(false)}>Отменить</button>
                            <button type="button" className="btn btn-danger" onClick={deleteHandler}>Удалить</button>
                        </>
                    }
                    {deleteConfirmed && !load &&
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => close(true)}>Назад</button>
                    }
                </div>
            </div>
        </div>
        </div>
    );
};

export default DeletionAlert;