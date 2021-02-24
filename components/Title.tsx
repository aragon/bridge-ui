import React from 'react'
import PropTypes from 'prop-types'
import { textStyle, useTheme, GU } from '@aragon/ui'

function Title({
  title,
  subtitle,
  topSpacing = 10 * GU,
  bottomSpacing = 7 * GU,
}) {
  const subtitleStyle = textStyle('title4')
  const theme = useTheme()
  return (
    <header
      style={{padding:`${topSpacing}px ${2 * GU}px ${bottomSpacing}px`}}
    >
      <h1
        style={{
          fontSize: "30px",
          fontWeight: "bolder",
          paddingBottom: `${subtitle ? 1 * GU : 0}px`
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <h4
          style={{color:`${theme.contentSecondary}`}}
        >
          {subtitle}
        </h4>
      )}
    </header>
  )
}

Title.propTypes = {
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node,
  topSpacing: PropTypes.number.isRequired,
  bottomSpacing: PropTypes.number.isRequired,
}

Title.defaultProps = {
  topSpacing: 10 * GU,
  bottomSpacing: 7 * GU,
}

export default Title