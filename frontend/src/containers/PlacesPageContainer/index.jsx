import qs from 'qs'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useLazyQuery } from '@apollo/react-hooks'

import PlacesPage from '../../components/PlacesPage'
import { SEARCH_PLACES } from '../../graphql'

function pathBuilderFunction({ args }) {
  const queryString = qs.stringify(args, { encode: false })
  return `/search-places?${queryString}`
}

function PlacesPageContainer() {
  const [searchPlaces, { loading, data, error }] = useLazyQuery(SEARCH_PLACES)
  const { register, handleSubmit } = useForm()

  const onSubmit = ({ latitude, longitude, distance }) => {
    const options = {
      variables: {
        center: [latitude.toString(), longitude.toString()].join(','),
        distance,
        q: 'kahvila',
        pathFunction: pathBuilderFunction,
      },
    }
    searchPlaces(options)
  }

  return (
    <PlacesPage
      data={data}
      error={error}
      loading={loading}
      onSubmit={handleSubmit(onSubmit)}
      register={register}
    />
  )
}

export default PlacesPageContainer
