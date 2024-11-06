export const login_validation = {
    name: 'username',
    type: 'text',
    id: 'username',
    placeholder: '',
    validation: {
        required: {
            value: true,
            message: 'Обязательно для заполнения',
        },
    },
}

export const new_login_validation = {
    name: 'login',
    type: 'text',
    id: 'login',
    placeholder: '',
    validation: {
        required: {
            value: true,
            message: 'Обязательно для заполнения',
        },
        pattern: {
            value:
                /^[^@]+$/,
            message: 'Логин не должен содержать символа @',
        },
        validate: value => {
            return (new TextEncoder().encode(value)).length <= 64 || 'Строка слишком длинная';
        }
    },
}

export const desc_validation = {
    name: 'description',
    multiline: true,
    id: 'description',
    placeholder: '',
    validation: {
        required: {
            value: true,
            message: 'Обязательно для заполнения',
        },
        maxLength: {
            value: 200,
            message: '200 characters max',
        },
    },
}

export const password_validation = {
    name: 'password',
    type: 'password',
    id: 'password',
    placeholder: '',
    validation: {
        required: {
            value: true,
            message: 'Обязательно для заполнения',
        },
    },
}

export const new_password_validation = {
    name: 'new_password',
    type: 'password',
    id: 'new_password',
    placeholder: '',
    validation: {
        required: {
            value: true,
            message: 'Обязательно для заполнения',
        },
        minLength: {
            value: 8,
            message: 'Минимальное кол-во символов - 8',
        },
        validate: value => {
            return (
                /\d/.test(value) &&
                /[`~+=\\/.,<>#$%^&*()!?]/.test(value) &&
                /[A-ZА-Я]/.test(value) &&
                /[a-zа-я]/.test(value)
            ) || 'Слабый пароль, обратите внимание на требования';
        }
    },
}

export const confirm_password_validation = {
    name: 'confirm_password',
    type: 'password',
    id: 'confirm_password',
    placeholder: '',
    validation: {
        required: {
            value: true,
            message: 'Обязательно для заполнения',
        },
    },
}

export const num_validation = (name, minValue, maxValue) => ({
    name: name,
    type: 'number',
    id: name,
    placeholder: '',
    valueAsNumber: true,
    validation: {
        required: {
            value: true,
            message: 'Обязательно для заполнения',
        },
        min: {
            value: minValue,
            message: "Минимальное значение: " + minValue
        },
        max: {
            value: maxValue,
            message: "Максимальное значение: " + maxValue
        }
    },
})

export const email_validation = {
    name: 'email',
    type: 'email',
    id: 'email',
    placeholder: '',
    validation: {
        required: {
            value: true,
            message: 'Обязательно для заполнения',
        },
        pattern: {
            value:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: 'Email имеет некорректный формат',
        },
    },
}

export const date_picker = (name) => {
    return {
        name: name,
        type: 'date',
        id: name,
        placeholder: "",
        defaultValue: new Date(Date.now()).toISOString().split('T')[0],
        validation: {
            required: {
                value: true,
                message: 'Обязательно для заполнения',
            }
        }
    }
}

export const textarea = (name, max_length) => {
    let properties = {
        multiline: true,
        name: name,
        type: 'text',
        id: name,
        placeholder: "",
        validation: {
            required: {
                value: true,
                message: 'Обязательно для заполнения',
            },
        }
    }
    if (max_length != null) {
        properties.validation.validate = value => {
            return (new TextEncoder().encode(value)).length <= max_length || 'Строка слишком длинная';
        }
    }
    return properties
}

export const max_byte_length_validation = (name, max_length) => {
    return {
        name: name,
        type: 'text',
        id: name,
        placeholder: "",
        validation: {
            required: {
                value: true,
                message: 'Обязательно для заполнения',
            },
            validate: value => {
                return (new TextEncoder().encode(value)).length <= max_length || 'Строка слишком длинная';
            }
        }
    }
}
