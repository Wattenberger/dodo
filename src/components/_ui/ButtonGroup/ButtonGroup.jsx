import React from "react";
import classNames from "class-names";
import Button from "components/_ui/Button/Button";

import "./ButtonGroup.scss";

const ButtonGroup = ({ options, value, onToggle, className, children, ...props }) => {
  const flattenedValues = (value || []).map(d => typeof d == "object" ? (d.id || d.label) : d)

  return (
    <div className={classNames(
      "ButtonGroup", className
    )} {...props}>
      {options.map(({ id, label, ...buttonProps }, i) =>
        <Button key={i}
                onClick={() => onToggle(options[i], i)}
                styleType={flattenedValues.includes(id || label) ? "primary" : "link"}
                {...buttonProps}>
          { label || options[i] }
        </Button>
      )}
    </div>
  )
}

export default ButtonGroup
