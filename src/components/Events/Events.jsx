import React, { useContext, useMemo, useState } from "react"
import { googleAuthContext } from "GoogleAuth"
import Event from "components/Event/Event"
import Button from "components/_ui/Button/Button"

import "./Events.scss"

const Events = () => {
  const { events, user } = useContext(googleAuthContext)
  const [isShowingAll, setIsShowingAll] = useState(false)
  console.log("events", events, user)

  const parsedEvents = useMemo(() => (
    isShowingAll ? events : events.slice(0, 10)
  ), [events, isShowingAll])

  return (
    <div className="Events">
      {parsedEvents.map(event => (
        <Event {...event} />
      ))}

      <Button styleType="link" onClick={() => setIsShowingAll(!isShowingAll)}>
        Show {isShowingAll ? "less" : "all"}
      </Button>
    </div>
  )
}

export default Events
