import cn from 'classnames'
import React, { CSSProperties } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

import { colors } from '../../constants/colors'

const Icon = styled(FontAwesomeIcon)`
  text-align: center;
  vertical-align: middle;
`

interface LoadingSpinnerProps {
  className?: string
  color?: string
  style?: CSSProperties
}

export function LoadingSpinner(props: LoadingSpinnerProps) {
  const { className, color, style } = props

  return (
    <Icon
      aria-hidden
      className={cn('loading-spinner', 'fa-spin', className)}
      color={color ?? colors.black}
      icon={faSpinner}
      style={style}
    />
  )
}
