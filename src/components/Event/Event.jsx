import React from "react"
import { timeFormat } from "d3-time-format"
import { timeHour, timeDay, timeMonth } from "d3-time"
import Icon from "components/_ui/Icon/Icon"
import { getOrdinal } from "utils"

import "./Event.scss"

const Event = ({ start, end, summary, description, location, attendees, status }) => {
  const isFlight = summary.startsWith("Flight to")
  const type = isFlight ? "flight" : "normal"
  const title = isFlight ? getFlightAirports({ summary, location }) : summary

  const numberOfAttendees = (attendees || []).length

  return (
    <div className={`Event Event--type-${type}`}>
      {isFlight && <Icon name="plane" className="Event__icon" size="xs" />}
      {!!location && !isFlight && (
        <a href={location} className="Event__icon">
          <Icon name="locationPin" size="xs" />
        </a>
      )}
      <div className="Event__title">
        { title }
        {/* {numberOfAttendees > 1 && (
          <div className="Event__attendees">
            { numberOfAttendees }
          </div>
        )} */}
      </div>

      <div className="Event__date">
        { formatTimeRange(start.dateTime || start.date, end.dateTime || end.date) }
      </div>
    </div>
  )
}

export default Event


const dayFormat = timeFormat("%-d")
const dateFormat = d => {
  const daysFromNow = timeDay.count(new Date(), d)
  return daysFromNow < 1 ? ""
  : daysFromNow < 2 ? "Tomorrow, "
  : daysFromNow < 7 ? timeFormat("%A")(d)
  : [timeFormat("%A, %B %-d")(d), getOrdinal(+dayFormat(d))].join("")
}
const dateTimeFormat = d => [dateFormat(d), hourFormat(d)].join(" ")
const adjacentDateTimeFormat = d => timeFormat("%A %-I:%M %p")(d).replace(":00", "")
const hourFormat = d => timeFormat("%-I:%M %p")(d).replace(":00", "")
const minuteFormat = timeFormat("%M")
const formatTimeRange = (start, end) => {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const hoursDiff = timeHour.count(startDate, endDate)
  const daysDiff = timeDay.count(startDate, endDate)
  const daysFromNow = timeDay.count(new Date(), startDate)
  const monthsDiff = timeMonth.count(startDate, endDate)
  return daysFromNow < 1 && daysDiff <= 1 ? [hourFormat(startDate), hourFormat(endDate)].join(" - ")
    // : daysFromNow < 1 ? [`Tomorrow, ${hourFormat(startDate)}`, hourFormat(endDate)].join(" - ")
    : daysDiff < 1 ? [dateTimeFormat(startDate), hourFormat(endDate)].join(" - ")
    : hoursDiff < 25 ? [dateTimeFormat(startDate), daysFromNow < 7 ? dateTimeFormat(endDate) : adjacentDateTimeFormat(endDate)].join(" - ")
    : monthsDiff < 1 ? [dateFormat(startDate), daysFromNow < 7 ? dateTimeFormat(endDate) : dayFormat(endDate)].join(" - ")
    : [dateFormat(startDate), dateFormat(endDate)].join(" - ")
}

const getFlightAirports = ({ summary, location }) => {
  return [
    location.slice(0, -4),
    summary.replace("Flight to ", "").split(" (")[0]
  ].join("    ⋅⋅⋅›   ")
}