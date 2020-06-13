import { bool, number, string } from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faSmile } from '@fortawesome/free-regular-svg-icons'
import { faWalking } from '@fortawesome/free-solid-svg-icons'

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
  font-size: 0.75rem;
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
  color: ${props => props.color || 'inherit'};
  font-size: 0.75rem;
  margin: 0rem 0.15rem;

  svg {
    margin-right: 0.2rem;
  }
`

const Name = styled.div`
  color: rgba(0, 0, 0, 0.85);
  font-family: Montserrat;
  font-size: 0.75rem;
  font-weight: 600;
  margin: 0.35rem 0.75rem 0rem 0.75rem;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Address = styled.div`
  font-size: 0.7rem;
  margin: 0.25rem 0.75rem 0rem 0.75rem;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const green = 'rgb(0, 156, 0)'
const red = 'rgb(220, 20, 60)'

function PlaceComponent({ distance, icon, name, openNow, rating, vicinity }) {
  return (
    <Outer>
      <Inner>
        <Icon>
          <img src={icon} alt="icon" />
        </Icon>
        <Name>{name}</Name>
        <Address>{vicinity}</Address>
        <Details>
          <Detail color={openNow ? green : red}>
            <FontAwesomeIcon icon={faClock} />
            {openNow ? 'open' : 'closed'}
          </Detail>
          <Detail>
            <FontAwesomeIcon icon={faWalking} />
            {distance} m
          </Detail>
          <Detail>
            <FontAwesomeIcon icon={faSmile} />
            {Number(rating).toFixed(1)}
          </Detail>
        </Details>
      </Inner>
    </Outer>
  )
}

PlaceComponent.propTypes = {
  distance: number.isRequired,
  icon: string.isRequired,
  name: string.isRequired,
  openNow: bool.isRequired,
  rating: number.isRequired,
  vicinity: string.isRequired,
}

PlaceComponent.defaultProps = {}

export default PlaceComponent
