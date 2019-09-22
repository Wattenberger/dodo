import React from "react";
import PropTypes from "prop-types";

import "./Button.scss";

const Button = ({ styleType, size, isUnstyled, canBeMultipleLines, doBlurOnClick, disabled, onClick, className, borderRadius, children, ...props, }) => {
    return (
        <button type="button" {...props}
            onClick={onClick}
            tabIndex={disabled ? -1 : 0}
            disabled={disabled}
            className={[
                className,
                !isUnstyled && "Button",
                !isUnstyled && `Button--style-type-${styleType}`,
                !isUnstyled && `Button--size-${size}`,
                !isUnstyled && `Button--radius-${borderRadius}`,
                !isUnstyled && `Button--${canBeMultipleLines ? "can-be-multiple-lines" : "keep-on-one-line"}`,
            ].filter(d => d).join(" ")}>
            { children }
        </button>
    );
}

Button.propTypes = {
    styleType: PropTypes.oneOf([
        "primary", "default", "link"
    ]),
    size: PropTypes.oneOf(["s", "m", "l", "xl"]),
    isUnstyled: PropTypes.bool,
    canBeMultipleLines: PropTypes.bool,
    doBlurOnClick: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    borderRadius: PropTypes.oneOf([
        "round", "square",
    ]),
}
Button.defaultProps = {
    styleType: "primary",
    size: "m",
    isUnstyled: false,
    canBeMultipleLines: false,
    doBlurOnClick: true,
    disabled: false,
    borderRadius: "square",
    onClick: () => {},
}

export default Button;
