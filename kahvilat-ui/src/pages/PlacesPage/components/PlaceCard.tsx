import React from 'react'
import styled from 'styled-components'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faSmile } from '@fortawesome/free-regular-svg-icons'
import { faWalking } from '@fortawesome/free-solid-svg-icons'

import { colors } from '../../../constants'

interface Props {
  address: string
  distance: number
  icon: string
  name: string
  openNow?: boolean
  rating: number
}

export function PlaceCard(props: Props): JSX.Element {
  const { address, distance, icon, name, openNow, rating } = props

  return (
    <Outer className="place-item">
      <Inner>
        <Icon className="place-icon">
          <img src={icon} alt="icon" />
        </Icon>
        <Name className="place-name">{name}</Name>
        <Address className="place-address">{address}</Address>
        <Details className="place-details">
          <Detail className="place-open-now" color={openNow ? colors.green : colors.red}>
            <FontAwesomeIcon icon={faClock} />
            {openNow ? 'auki' : 'suljettu'}
          </Detail>
          <Detail className="place-distance">
            <FontAwesomeIcon icon={faWalking} />
            {distance} m
          </Detail>
          <Detail className="place-rating">
            <FontAwesomeIcon icon={faSmile} />
            {Number(rating).toFixed(1)}
          </Detail>
        </Details>
      </Inner>
    </Outer>
  )
}

const Outer = styled.li`
  display: block;
  flex-basis: 25%;
  min-width: 250px;
  overflow: hidden;

  @media (max-width: 825px) {
    flex-basis: 33%;
    min-width: auto;
  }

  @media (max-width: 625px) {
    flex-basis: 50%;
  }

  @media (max-width: 425px) {
    flex-basis: 100%;
  }
`

const Inner = styled.div`
  border-radius: 3px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.25);
  margin: 0.5rem;

  @media (max-width: 425px) {
    margin: 0.4rem 0.25rem;
  }
`

const Icon = styled.div`
  margin: 0 auto;
  margin-top: 0.4rem;
  width: 100%;
  text-align: center;

  > img {
    height: 35px;
    width: 35px;
  }
`

const Details = styled.div`
  border-top: 1px solid #f0f0f0;
  display: flex;
  font-size: 0.9rem;
  justify-content: center;
  margin-top: 0.65rem;
  padding: 0.425rem 0rem;

  > div:not(:last-of-type)::after {
    color: rgb(50, 50, 50);
    content: '·';
    cursor: default;
    margin-left: 0.5rem;
    margin-right: 0.35rem;
  }
`

const Detail = styled.div`
  color: ${(props) => props.color || 'inherit'};
  font-size: 0.9rem;
  margin: 0rem 0.15rem;

  svg {
    margin-right: 0.2rem;
  }
`

const Name = styled.div`
  color: rgba(0, 0, 0, 0.85);
  font-family: Montserrat;
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0.35rem 0.75rem 0rem 0.75rem;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Address = styled.div`
  font-size: 0.9rem;
  margin: 0.25rem 0.75rem 0rem 0.75rem;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
`
