import React from 'react';
import ObjectElement from "./ObjectElement";
import {translate} from "../../../langConfig";

const ObjectsTable = (props) => {
    return (
        <div>
            <div className="col-md-9 container border border-0 rounded-2 shadow p-0">
            {props.objects[0] == null ? "Страница пустая" :
                <table className="table table-striped h-100 w-100 table-bordered">
                    <thead className="">
                        <tr>
                            {Object.keys(props.objects[0]).map((key) =>
                                <th scope="col" className="align-middle">
                                    {props.enableEditor && props.orderFields.includes(key) ?
                                        <div className="">
                                            <button
                                                className="btn bg-body p-0 fw-bold d-flex justify-content-center align-items-center"
                                                onClick={() => props.changeOrder(key)}
                                            >
                                                {translate.field[key].i}
                                                {key === props.orderParam ?
                                                    <i className={"fa fa-arrow-down" + (props.isOrderDescending ? " fa-rotate-180" : "")}></i>
                                                    : null}
                                            </button>
                                        </div>
                                        :
                                        translate.field[key].i
                                    }
                                </th>
                            )}
                            {props.enableEditor &&
                                <>
                                    <th className="text-reset fw-bold align-middle">Изменение</th>
                                    <th className="text-reset fw-bold align-middle">Удаление</th>
                                </>
                            }
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {props.objects.map((object) => <ObjectElement object={object} enableEditor={props.enableEditor} entity={props.entity} onDeleteHandler={props.onDeleteHandler}/>)}
                    </tbody>
                </table>
            }
            </div>
        </div>
    );
};

export default ObjectsTable;