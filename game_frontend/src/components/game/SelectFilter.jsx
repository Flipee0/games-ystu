import React from 'react';
import Select from "react-select";

const SelectFilter = ({options, name, onChange, placeholder}) => {
    return (
        <div className="row mb-1">
            <div className="col-md-12">
                <Select
                    options={options}
                    classNamePrefix={name}
                    isSearchable={true}
                    name={name}
                    onChange={(val) => onChange(val.map((elem) => elem.value))}
                    classNames={{
                        container: (state) => "form-control p-0",
                        control: (state) => "bg-body text-reset border-0",
                        option: (state) => "bg-body text-reset",
                        menu: (state) => "bg-body text-reset",
                        singleValue: (state) => "bg-body text-reset",
                        multiValue: (state) => "bg-body text-reset",
                        multiValueLabel: (state) => "bg-body text-reset",
                        multiValueRemove: (state) => "bg-body text-reset",
                        input: (state) => "text-white",
                    }}
                    isClearable={true}
                    placeholder={placeholder}
                    isMulti={true}
                />
            </div>
        </div>
    );
};

export default SelectFilter;