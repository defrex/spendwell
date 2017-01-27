
import { PropTypes } from 'react'

import styles from 'sass/components/card-actions.scss'

export default function CardActions (props) {
  const { className, ..._props } = props
  return (
    <div className={`card-actions ${styles.root} ${className || ''}`} {..._props}/>
  )
}

CardActions.propTypes = {
  className: PropTypes.string,
}
