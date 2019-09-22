import React, { useMemo } from "react"
import Icon from "components/_ui/Icon/Icon"

import "./Task.scss"

const Task = ({ name, context, tags=[], type, contextColors, tagColors, onEdit, onDelete }) => {
  return (
    <div className={`Task Task--type-${type}`}>
      <div className="Task__title">
        { name }
        <div className="Task__actions">
          <button className="Task__actions__item" onClick={onEdit}>
            <Icon name="configure" size="s" />
          </button>
          <button className="Task__actions__item" onClick={onDelete}>
            <Icon name="trash" size="s" />
          </button>
        </div>
      </div>
      <div className="Task__meta">
        <div className="Task__context" style={{color: contextColors[context]}}>
          { context }
        </div>
        <div className="Task__tags">
          { tags.map((d, i) => (<>
            {!!i && ", "}
            <span style={{color: tagColors[d]}}>{ d }</span>
          </>)) }
        </div>
      </div>
    </div>
  )
}

export default Task

