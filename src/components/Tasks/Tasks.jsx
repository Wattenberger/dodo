import React, { useContext, useEffect, useMemo, useState } from "react"
import { tasksContext } from "FirebaseWrapper"
import ButtonGroup from "components/_ui/ButtonGroup/ButtonGroup"
import Form from "components/_ui/Form/Form"
import Task from "components/Task/Task"
import TaskForm from "components/TaskForm/TaskForm"

import "./Tasks.scss"

const Tasks = () => {
  const { tasks, contexts, tags, contextColors, tagColors, removeTask } = useContext(tasksContext)
  const [contextFilters, setContextFilters] = useState([])
  const [tagFilters, setTagFilters] = useState([])
  console.log("tasks", tasks)

  const fields = useMemo(() => [{
    id: "contexts",
    label: "Contexts",
    type: "multi-select",
    options: contexts.map(d => ({
      label: d,
      value: d,
      color: contextColors[d],
    })),
  },{
    id: "tags",
    label: "Tags",
    type: "multi-select",
    options: tags.map(d => ({
      label: d,
      value: d,
      color: tagColors[d],
    })),
  }], [contexts, tags])

  const onFiltersChange = newFilters => {
    console.log("newFilters", newFilters)
    console.log("fields", fields)
    setContextFilters(newFilters.contexts ? newFilters.contexts.map(d => d.value) : [])
    setTagFilters(newFilters.tags ? newFilters.tags.map(d => d.value) : [])
  }

  const onEditLocal = task => () => {
  }

  const parsedTasks = useMemo(() => (
    tasks.filter(d => (
      (!contextFilters.length || contextFilters.includes(d.context)) &&
      (!tagFilters.length || (d.tags || []).filter(tag => tagFilters.includes(tag)).length > 0)
    ))
  ), [tasks, contextFilters, tagFilters])

  return (
    <div className="Tasks">
      <div className="Tasks__filters">
        <Form fields={fields} onChange={onFiltersChange} />
        {/* <ButtonGroup
          options={contextOptions}
          value={activeContexts}
          onToggle={onChangeActiveContexts}
        /> */}
      </div>
      {(parsedTasks || []).map(task => (
        <Task
          {...task}
          {...{contextColors, tagColors}}
          onDelete={() => removeTask(task)}
          onEdit={onEditLocal(task)}
        />
      ))}

      <TaskForm />
    </div>
  )
}

export default Tasks
