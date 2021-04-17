import { Place } from '../types'

const place: Place = {
  business_status: 'OPERATIONAL',
  geometry: {
    location: { lat: 60.1611124, lng: 24.9417875 },
    viewport: {
      northeast: { lat: 60.16243152989271, lng: 24.94304767989272 },
      southwest: { lat: 60.15973187010727, lng: 24.94034802010728 },
    },
  },
  icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/cafe-71.png',
  id: '4ed1c053cd3806efbba2786cc74e20af94df9d4c',
  name: 'Brooklyn Cafe',
  opening_hours: { open_now: false },
  photos: [],
  place_id: 'ChIJgUCiJ7YLkkYRj6mOfjUbO5c',
  plus_code: {
    compound_code: '5W6R+CP Helsinki',
    global_code: '9GG65W6R+CP',
  },
  price_level: 2,
  rating: 4.5,
  reference: 'ChIJgUCiJ7YLkkYRj6mOfjUbO5c',
  scope: 'GOOGLE',
  types: ['cafe', 'food', 'point_of_interest', 'establishment'],
  user_ratings_total: 477,
  vicinity: 'Fredrikinkatu 19, Helsinki',
}

export default place
