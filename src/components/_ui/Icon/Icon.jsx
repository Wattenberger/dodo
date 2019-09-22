import React from "react";
import PropTypes from "prop-types";

import iconPaths from './iconPaths.jsx';
import './Icon.scss';

const Icon = ({ name, size, direction, hasCircle, hasTriangle, padding, className, ...props }) => {
    const parsedPadding = padding ||
        (hasCircle || hasTriangle ? 8 : 0);
    const viewBoxDimension = 25 + parsedPadding * 2;
    const viewBoxStart = 0 - parsedPadding;

    return (
        <svg
            className={[
                "Icon",
                `Icon--direction-${direction}`,
                `Icon--name-${name}`,
                `Icon--${
                    hasCircle ? "has-circle" :
                    hasTriangle ? "has-triangle" :
                        "solo"
                }`,
                className
            ].join(" ")}
            width={sizeDimensions[size]}
            height={sizeDimensions[size]}
            viewBox={[ viewBoxStart, viewBoxStart, viewBoxDimension, viewBoxDimension ].join(" ")}
            aria-label={`${name} icon`}
            {...props}>
            {hasCircle && (
                <circle
                    className={[
                        'Icon__circle',
                        ...(className || "").split(" ").map(name => `${name}__icon-circle`)
                    ].join(" ")}
                    r={12 + parsedPadding}
                    cx="12.5"
                    cy="12.5"
                />
            )}
            {hasTriangle && (
                <path
                    className={[
                        'Icon__triangle',
                        ...(className || "").split(" ").map(name => `${name}__icon-triangle`)
                    ].join(" ")}
                    style={{
                        transform: `scale(${1 + (parsedPadding / 25)})`
                    }}
                    d="M0.2,21.8L10.5,1.2c0.8-1.6,3.2-1.6,4,0l10.3,20.6c0.7,1.5-0.3,3.2-2,3.2H2.2C0.6,25-0.5,23.3,0.2,21.8z"
                />
            )}
            {iconPaths[name]}
        </svg>
    );
};

export const sizeDimensions = {
    xxs: 5,
    xs: 11,
    s: 16,
    m: 20,
    l: 27,
    xl: 35,
    xxl: 45,
    xxxl: 90,
};

Icon.propTypes = {
    name: PropTypes.oneOf(Object.keys(iconPaths)),
    size: PropTypes.oneOf(Object.keys(sizeDimensions)),
    direction: PropTypes.oneOf([ "n", "ne", "e", "se", "s", "sw", "w", "nw" ]),
    hasCircle: PropTypes.bool,
    padding: PropTypes.number,
    hasTriangle: PropTypes.bool,
};

Icon.defaultProps = {
    size: 'm',
    hasCircle: false,
    padding: 0,
    hasTriangle: false,
};

export default Icon;
