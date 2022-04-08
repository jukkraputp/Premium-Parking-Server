import './DateBlock.css'

import React from 'react'

function DateBlock({details}) {
  return (
    <div className='date-block'>
     
        <b>{details.day}</b>
        <div className='date-block-month-year'>
          <p>{details.month}</p>
          <p>{details.year}</p>
        </div>
    </div>
  )
}

export default DateBlock