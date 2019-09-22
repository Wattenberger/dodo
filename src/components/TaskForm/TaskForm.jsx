import React, { useContext, useMemo } from "react"
import { tasksContext } from "FirebaseWrapper"
import Form from "components/_ui/Form/Form"

import "./TaskForm.scss"

const TaskForm = () => {
  const { tasks, contexts, tags, addTask } = useContext(tasksContext)

  console.log(contexts)
  const onSubmitLocal = values => {
    console.log(values)
    addTask(values)
  }

  const fields = useMemo(() => [{
    label: "Name",
    id: "name",
    isRequired: true,
  },{
    label: "Context",
    id: "context",
    options: contexts,
    type: "createable-select"
  },{
    label: "Tags",
    id: "tags",
    options: tags,
    type: "createable-select",
    isMulti: true,
  }], [tags])

  return (
    <div className="TaskForm">
      <h3>
        Create a new task
      </h3>
      <Form
        fields={fields}
        submitProps={submitProps}
        onSubmit={onSubmitLocal}
        doClearOnSubmit
      />
    </div>
  )
}

export default TaskForm

const submitProps = {
  children: "Create task"
}