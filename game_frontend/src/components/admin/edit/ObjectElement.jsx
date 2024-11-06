import React from 'react';
import AdditionalInfo from "../../AdditionalInfo";
import RelativeInfo from "../RelativeInfo";
import {deleteObject} from "./Delete";

const ObjectElement = (props) => {
    const deleteHandler = () => {
        props.onDeleteHandler(props.object.id)
    }

    return (
        <tr className="text-wrap">
            {Object.entries(props.object).map(([key, value]) =>
                <td>
                    {typeof value === 'object' ? value == null ? 'Нет' :
                        <RelativeInfo objects={value}/>
                        :
                        value.toString().length > 50 ?
                            <AdditionalInfo>
                                <div className="bg-body border p-2 rounded shadow">{value}</div>
                            </AdditionalInfo>
                            : value
                    }
                </td>
            )}
            {props.enableEditor ?
                <>
                    <td className=""><a className="btn btn-primary" href={"/admin/edit/" + props.entity + "/" + props.object.id} role="button">Изменить</a></td>
                    <td><button className="btn btn-danger" role="button" onClick={deleteHandler}>Удалить</button></td>
                </>
                : null}

        </tr>
    );
};

export default ObjectElement;