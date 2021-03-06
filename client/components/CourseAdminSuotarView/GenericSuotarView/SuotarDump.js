import React from 'react'

import SuotarPayload from '../SuotarPayload'

const suotarFriendlyCompleted = (completed) => {
  const date = new Date(completed)
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
}

const SuotarDump = ({ students }) => {
  const suotarString = students
    .map(
      (stud) =>
        `${stud.studentNumber};;${stud.credits},0;${
          stud.language || ''
        };${suotarFriendlyCompleted(stud.completed)}`,
    )
    .join('\n')

  if (!suotarString) return null

  return (
    <div style={{ float: 'right' }}>
      <h3>for suotar</h3>
      <SuotarPayload payload={suotarString} />
    </div>
  )
}

export default SuotarDump
