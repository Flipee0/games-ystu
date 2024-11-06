import React, {useEffect, useState} from 'react';
import {instance} from "../../../api.config";
import CatalogElement from "../../game/CatalogElement";
import ObjectsTable from "../../admin/edit/ObjectsTable";
import PageControl from "../../PageControl";
import RelationalSelect from "./RelationalSelect";
import {values} from "mobx";
import {translate} from "../../../langConfig";

const config = {
    user: {
        label: "login"
    },
    locale: {
        label: "language"
    },
    platform: {
        label: "name"
    },
    company: {
        label: "name"
    },
    genre: {
        label: "name"
    },
    game: {
        label: "name"
    },
    series: {
        label: "name"
    },
}

const InputRelation = ({entity, name, multi, required, control, defaultValue}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        instance.get("/" + entity + "/read-objects")
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
    }, [])

    return (
        <div className="text-start">
            <label className="text-start">{translate.field[name].i}</label>
            {loading && <div>A moment please...</div>}
            {error && (
                <div>{`There is a problem fetching the post data - ${error}`}</div>
            )}
            {!loading && !error && <RelationalSelect
                name={name}
                multi={multi}
                required={required}
                control={control}
                defaultValue={defaultValue}
                data={data.map((object) => ({
                    value: object.id,
                    label: object[config[entity]["label"]],
                }))}/>}
        </div>
    );
};

export default InputRelation;