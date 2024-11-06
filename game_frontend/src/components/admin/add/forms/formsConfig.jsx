import {Input} from "../../../Input";
import {date_picker, textarea, max_byte_length_validation, num_validation} from "../../../../utils/inputValidations";
import InputImage from "../../../forms/image/InputImage";
import InputRelation from "../../../forms/single_relation/InputRelation";
import React from "react";

export const getInputFields = (entity, methods, data) => {
    const getData = (field) => {
        if (data == null) return null
        if (typeof data[field] === 'object' && data[field] != null) {
            if (data[field] instanceof Array) {
                if (data[field].length === 0) {
                    return null
                }
                return data[field].map((object) => object.id)
            }
            return data[field].id
        }
        return data[field]
    }

    switch (entity) {
        case "game":
            return (
                <>
                    <Input {...max_byte_length_validation("name", 64)} defaultValue={getData(["name"])}/>
                    <Input {...date_picker("release_date")} defaultValue={getData(["release_date"])}/>
                    <Input {...textarea("description")} defaultValue={getData(["description"])}/>
                    <Input {...num_validation("age_rating", 0, 21)} defaultValue={getData("age_rating")}/>
                    <InputImage name="logo" methods={methods} required={true} type="logo" defaultValue={getData(["logo"])}/>
                    <InputRelation control={methods.control} entity="series" name="series_id" multi={false} required={false} defaultValue={getData("series")}/>
                    <InputRelation control={methods.control} entity="genre" name="genres_ids" multi={true} required={true} defaultValue={getData("genres")}/>
                    <InputRelation control={methods.control} entity="company" name="developers_ids" multi={true} required={true} defaultValue={getData("developers")}/>
                    <InputRelation control={methods.control} entity="company" name="distributors_ids" multi={true} required={true} defaultValue={getData("distributors")}/>
                    <InputRelation control={methods.control} entity="locale" name="locales_ids" multi={true} required={true} defaultValue={getData("locales")}/>
                    <InputRelation control={methods.control} entity="platform" name="platforms_ids" multi={true} required={true} defaultValue={getData("platforms")}/>
                </>
            )
        case "company":
            return (
                <>
                    <Input {...max_byte_length_validation("name", 64)} defaultValue={getData(["name"])}/>
                    <InputImage name="logo" methods={methods} required={true} type="logo" defaultValue={getData(["logo"])}/>
                    <Input {...max_byte_length_validation("country", 64)} defaultValue={getData(["name"])}/>
                    <Input {...textarea("description")} defaultValue={getData(["description"])}/>
                </>
            )
        case "genre":
            return (
                <>
                    <Input {...max_byte_length_validation("name", 64)} defaultValue={getData(["name"])}/>
                    <Input {...textarea("description")} defaultValue={getData(["description"])}/>
                </>
            )
        case "locale":
            return (
                <>
                    <Input {...max_byte_length_validation("language", 64)} defaultValue={getData(["language"])}/>
                </>
            )
        case "platform":
            return (
                <>
                    <Input {...max_byte_length_validation("name", 64)} defaultValue={getData(["name"])}/>
                </>
            )
        case "series":
            return (
                <>
                    <Input {...max_byte_length_validation("name", 64)} defaultValue={getData(["name"])}/>
                    <Input {...textarea("description")} defaultValue={getData(["description"])}/>
                    <InputImage name="logo" methods={methods} required={true} type="logo" defaultValue={getData(["logo"])}/>
                </>
            )
    }
}