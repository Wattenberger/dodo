import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import chroma from "chroma-js"
import classNames from "class-names"
import CreatableSelect from 'react-select/creatable'
import Select from 'react-select'
import Button from "components/_ui/Button/Button"
import Icon from "components/_ui/Icon/Icon"
// import { useOnKeyPress } from '../../hooks'
import { isEmpty } from "utils"

import './Form.scss'

const Form = ({ fields, error, doDisableSubmitWithErrors, extraButtons, cancelProps, submitProps, doClearOnSubmit, onChange, onSubmit, className, children, ...props }) => {
    const [values, setValues] = useState({})
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [didJustSubmit, setDidJustSubmit] = useState(false)
    const [isDirty, setIsDirty] = useState(false)

    useEffect(() => {
        const parsedValues = pairsToObject(
            fields.map(field => [
                field.id,
                values[field.id]
                || field.initialValue
                // || field.options && field.options[0]
                || "",
            ])
        )
        setValues(parsedValues)
        if (onChange) onChange(parsedValues)
    }, [fields])

    useEffect(() => {
        setErrors(getErrors())
        setIsDirty(true)
        setDidJustSubmit(false)
    }, [values])

    const getErrors = () => {
        const parsedErrors = pairsToObject(
            fields.map(field => [
                field.id,
                getFieldError(values[field.id], field)
            ])
            .filter(field => field[1])
        )
        return parsedErrors
    }

    const getFieldError = (value, field={}) => (
        !value
            && field.isRequired
            ? <>{ (typeof field.label != "string" || field.label.length > 20) ? "This field" : <b>{ field.label }</b> } is required</>
        : typeof field.validationCheck == "function"
            ? field.validationCheck(value)
        : field.type == "email"
            && !isEmail(value)
            ? "Please use a valid email address"
        : field.type == "url"
            && !isUrl(value)
            ? "Please use a valid url"
        : false
    )

    const onChangeLocal = fieldId => newValue => {
        const newValues = {
            ...values,
            [fieldId]: newValue,
        }
        setValues(newValues)
        if (onChange) onChange(newValues)
    }

    const onSubmitLocal = e => {
        e.preventDefault()

        setDidJustSubmit(true)

        if (!isEmpty(errors)) {
            setIsDirty(false)
            return null
        }

        onSubmit(values)
        setIsSubmitting(true)

        if (doClearOnSubmit) {
            setValues(pairsToObject(
                fields.map(field => [
                    field.id,
                    field.initialValue
                    // || field.options && field.options[0]
                    || "",
                ])
            ))
        }
    }

    return (
        <form {...props}
            className={[
                "Form",
                `Form--is-${isSubmitting ? "submitting" : "normal"}`,
                className
            ].filter(d => d)
            .join(" ")
            }
            onSubmit={onSubmitLocal}>
            <div className="Form__fields">
                {fields.map(field => (
                    <FormField
                        key={field.id}
                        onChange={onChangeLocal(field.id)}
                        {...field}
                        value={values[field.id]}
                        error={didJustSubmit && !isSubmitting ? errors[field.id] : null}
                    />
                ))}
            </div>
            { children }
            {error && (
                <div className="Form__errors">
                    { error }
                </div>
            )}
            <div className="Form__buttons">
                {cancelProps && (
                    <Button
                        styleType="tertiary"
                        size="l"
                        {...cancelProps}
                        className={classNames('Form__cancel', cancelProps.className)}
                    >
                        { cancelProps.children }
                    </Button>
                )}
                {onSubmit && (
                    <Button
                        styleType="primary"
                        type="submit"
                        size="l"
                        disabled={doDisableSubmitWithErrors && !isEmpty(errors)}
                        {...submitProps}
                        className={classNames('Form__submit', submitProps.className)}
                        onClick={onSubmitLocal}
                    >
                        { submitProps.children || "Submit" }
                    </Button>
                )}
                { extraButtons }
            </div>
        </form>
    )
}
Form.propTypes = {
    fields: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            label: PropTypes.string,
            type: PropTypes.oneOf([ "text", "email", "url", "password", "select", "createable-select", "multi-select", "textarea", "checkbox", "note" ]),
            note: PropTypes.oneOf(PropTypes.string, PropTypes.object),
            isHidden: PropTypes.bool,
            isRequired: PropTypes.bool,
        })
    ),
    error: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.string,
    ]),
    submitProps: PropTypes.object,
    extraButtons: PropTypes.object,
    cancelProps: PropTypes.object,
    doDisableSubmitWithErrors: PropTypes.bool,
    onSubmit: PropTypes.func,
    onChange: PropTypes.func,
}
const noop = () => {}
Form.defaultProps = {
    fields: [],
    submitProps: {},
    doDisableSubmitWithErrors: false,
    // onSubmit: noop,
    // onChange: noop,
}

export default Form

function pairsToObject(arr) {
    let result = {}
    arr.forEach(([key, value]) => {
        if (!key) return
        result[key] = value
    })
    return result
}

function isEmail(email) {
    const re = /^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
}
function isUrl(url) {
    const re = /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/
    return re.test(String(url).toLowerCase())
}


const FormField = ({ id, label, value, note, type="text", options, size="m", validationCheck, error, isHidden, className, isRequired, onChange, initialValue, ...props }) => {
    const localOnChange = e => {
        const newValue = e.target.value
        onChange(newValue)
    }
    const localOnToggle = e => {
        const newValue = !value
        onChange(newValue)
    }

    return (
        <div className={classNames(`FormField FormField--type-${type} FormField--size-${size}`, `FormField--is-${value ? "populated" : "empty"}`, {
            'FormField--is-required': isRequired,
            'FormField--is-hidden': isHidden,
        }, `FormField--id-${id}`)}>
            <div className="FormField__wrapper">
                {type == "note" ? null
                : type == "select" ? (
                    <select name={id} className="FormField__input FormField__input--select" onChange={localOnChange}>
                        {options.map(option => (
                            <option key={option} value={option}>{ option }</option>
                        ))}
                    </select>
                ) : type == "createable-select" ? (
                    <CreatableSelect
                        {...props}
                        name={id}
                        className="FormField__input FormField__input--createable-select"
                        classNamePrefix="FormField__createable"
                        value={value
                            ? props.isMulti
                                ? value.map(d => ({label: d, value: d}))
                                : {label: value, value}
                            : value
                        }
                        onChange={newValue => onChange(
                            props.isMulti ? newValue.map(d => !d ? d : d.value)
                            : !newValue ? newValue : newValue.value
                        )}
                        onKeyDown={e => e.stopPropagation()}
                        isClearable
                        options={options.map(d => typeof d == "object" ? d : {label: d, value: d})}
                    />
                ) : type == "multi-select" ? (
                    <Select
                        {...props}
                        name={id}
                        className="FormField__input FormField__input--multi-select"
                        classNamePrefix="FormField__multi"
                        value={Array.isArray(value)
                            ? value.map(d => typeof d == "object" ? d : {label: d, value: d})
                            : value
                        }
                        onChange={onChange}
                        onKeyDown={e => e.stopPropagation()}
                        isClearable
                        isMulti
                        options={options.map(d => typeof d == "object" ? d : {label: d, value: d})}
                        styles={selectStyles}
                    />
                ) : type == "textarea" ? (
                    <textarea {...props}
                        name={id}
                        className={classNames("FormField__input", `FormField__input--is-${value ? "populated" : "empty"}`, className)}
                        value={value || ""}
                        onChange={localOnChange}
                    />
                ) : type == "checkbox" ? (
                    <>
                        {!!value && <Icon name="check" className="FormField__checkbox-icon" />}
                        <input type="checkbox" {...props}
                            name={id}
                            id={id}
                            className={classNames("FormField__input", "FormField__input--checkbox", className)}
                            value={value}
                            onChange={localOnToggle}
                        />
                    </>
                ) : (
                    <input {...props}
                        name={id}
                        id={id}
                        type={type}
                        className={classNames('FormField__input FormField__input--textarea', `FormField__input--is-${value ? 'populated' : 'empty'}`, className)}
                        value={value || ""}
                        onChange={localOnChange}
                    />
                )}

                {label && (
                    <label className="FormField__label" htmlFor={id}>
                        { label }
                    </label>
                )}

                {note && (
                    <div className="FormField__note">
                        { note }
                    </div>
                )}

                {error && (
                    <div className="FormField__error">{ error }</div>
                )}
            </div>
        </div>
    )
}

const selectStyles = {
  control: styles => ({ ...styles, backgroundColor: 'white' }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    if (!data.color) return styles
    const color = chroma(data.color);
    if (!color.alpha) return styles
    return {
      ...styles,
      backgroundColor: isDisabled ? null
        : isSelected ? data.color
        : isFocused ? color.alpha(0.1).css()
        : null,
      color: isDisabled
        ? '#ccc'
        : isSelected
        ? chroma.contrast(color, 'white') > 2
          ? 'white'
          : 'black'
        : data.color,
      cursor: isDisabled ? 'not-allowed' : 'default',

      ':active': {
        ...styles[':active'],
        backgroundColor: !isDisabled && (isSelected ? data.color : color.alpha(0.3).css()),
      },
    };
  },
  multiValue: (styles, { data }) => {
    if (!data.color) return styles
    const color = chroma(data.color)
    if (!color.alpha) return styles
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css(),
    };
  },
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: data.color,
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: data.color,
    ':hover': {
      backgroundColor: data.color,
      color: 'white',
    },
  }),
}