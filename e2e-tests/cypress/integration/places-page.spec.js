/// <reference types="cypress" />

context('Places Page', () => {
  beforeEach(() => {
    cy.reload()
    cy.visit('/places')
  })

  it('should have a document title', () => {
    cy.title().should('include', 'kahvilat.app')
  })

  it('should render an instruction text for the user', () => {
    cy.get('main > p').contains('Klikkaa "ETSI KAHVILAT" aloittaaksesi.')
  })

  it('should render the places map', () => {
    cy.get('input#address').type('Fredrikinkatu 22, Helsinki')
    cy.get('button').contains('Etsi kahvilat').click()
    cy.get('#places-map').should('exist')
  })

  it('should render the footer', () => {
    cy.get('footer > ul > a').should('have.length', 2).as('footerLinks')
    cy.get('@footerLinks').first().contains('Privacy statement')
    cy.get('@footerLinks').first().next().contains('Terms of service')
    cy.get('footer > p').contains('© 2020 Purelogic Softworks')
  })

  it('should fetch and render the correct amount of places', () => {
    const placesUrl = '**/find-places?keyword=coffee&latitude=60.1631932&longitude=24.93846&radius=250&type=cafe'
    const morePlacesUrl = '**/find-places?cursor=token2'
    cy.intercept('GET', placesUrl).as('fetchPlaces')
    cy.intercept('GET', morePlacesUrl).as('fetchMorePlaces')
    cy.get('input#address').type('Fredrikinkatu 22, Helsinki')
    cy.get('span#distance').find('span').contains('250 m').click()
    cy.get('button').contains('Etsi kahvilat').click()
    cy.wait('@fetchPlaces').its('response.body.results').should('have.length', 1)
    cy.wait('@fetchMorePlaces').its('response.body.results').should('have.length', 1)
    cy.get('#places-list').find('.place-item').should('have.length', 2)
  })

  it('should fetch and render the correct amount of places, given a larger distance', () => {
    const placesUrl = '**/find-places?keyword=coffee&latitude=60.1631932&longitude=24.93846&radius=750&type=cafe'
    const morePlacesUrl = '**/find-places?cursor=token1'
    cy.intercept('GET', placesUrl).as('fetchPlaces')
    cy.intercept('GET', morePlacesUrl).as('fetchMorePlaces')
    cy.get('input#address').type('Fredrikinkatu 22, Helsinki')
    cy.get('span#distance').find('span').contains('750 m').click()
    cy.get('button').contains('Etsi kahvilat').click()
    cy.wait('@fetchPlaces').its('response.body.results').should('have.length', 3)
    cy.wait('@fetchMorePlaces').its('response.body.results').should('have.length', 3)
    cy.get('#places-list').find('.place-item').should('have.length', 6)
  })

  it('should re-fetch address and places data when selecting a different address', () => {
    const addressUrl1 = '**/find-address?address=Fredrikinkatu%2022,%20Helsinki'
    const addressUrl2 = '**/find-address?address=Per%C3%A4miehenkatu%201,%20Helsinki'
    const placesUrl1 = '**/find-places?keyword=coffee&latitude=60.1631932&longitude=24.93846&radius=500&type=cafe'
    const placesUrl2 = '**/find-places?keyword=coffee&latitude=60.1580323&longitude=24.9352637&radius=500&type=cafe'
    cy.intercept('GET', addressUrl1).as('fetchAddress1')
    cy.intercept('GET', addressUrl2).as('fetchAddress2')
    cy.intercept('GET', placesUrl1).as('fetchPlaces1')
    cy.intercept('GET', placesUrl2).as('fetchPlaces2')
    cy.get('input#address').type('Fredrikinkatu 22, Helsinki')
    cy.get('button').contains('Etsi kahvilat').click()
    cy.wait('@fetchAddress1').its('response.body.results').should('have.length', 1)
    cy.wait('@fetchPlaces1').its('response.body.results').should('have.length', 1)
    cy.get('input#address').should('have.value', 'Fredrikinkatu 22, 00120 Helsinki, Suomi')
    cy.get('#places-list').find('.place-name').should('have.length', 2).first().contains('Andante Coffee')
    cy.get('input#address').clear().type('Perämiehenkatu 1, Helsinki')
    cy.get('button').contains('Etsi kahvilat').click()
    cy.wait('@fetchAddress2').its('response.body.results').should('have.length', 1)
    cy.wait('@fetchPlaces2').its('response.body.results').should('have.length', 1)
    cy.get('input#address').should('have.value', 'Perämiehenkatu 1, 00150 Helsinki, Suomi')
    cy.get('#places-list').find('.place-name').should('have.length', 2).first().contains('Kaffa Roastery')
  })

  it('should re-fetch places when selecting a different distance', () => {
    const placesUrl1 = '**/find-places?keyword=coffee&latitude=60.1631932&longitude=24.93846&radius=250&type=cafe'
    const placesUrl2 = '**/find-places?keyword=coffee&latitude=60.1631932&longitude=24.93846&radius=500&type=cafe'
    cy.intercept('GET', placesUrl1).as('fetchPlaces1')
    cy.intercept('GET', placesUrl2).as('fetchPlaces2')
    cy.get('input#address').type('Fredrikinkatu 22, Helsinki')
    cy.get('span#distance').find('span').contains('250 m').click()
    cy.get('button').contains('Etsi kahvilat').click()
    cy.wait('@fetchPlaces1').its('response.body.results').should('have.length', 1)
    cy.get('span#distance').find('span').contains('500 m').click()
    cy.get('button').contains('Etsi kahvilat').click()
    cy.wait('@fetchPlaces2').its('response.body.results').should('have.length', 1)
  })

  it('should render the correct details for a place that is currently open', () => {
    cy.get('input#address').type('Fredrikinkatu 22, Helsinki')
    cy.get('button').contains('Etsi kahvilat').click()
    cy.get('#places-list').find('.place-item').should('have.length', 2).first().as('placeItem')
    cy.get('@placeItem').find('.place-details').as('placeDetails')
    cy.get('@placeItem').find('.place-icon img').should('exist')
    cy.get('@placeItem').find('.place-name').contains('Andante Coffee')
    cy.get('@placeItem').find('.place-address').contains('Fredrikinkatu 20, Helsinki')
    cy.get('@placeDetails').find('.place-open-now').contains('auki')
    cy.get('@placeDetails').find('.place-distance').contains('100 m')
    cy.get('@placeDetails').find('.place-rating').contains('4.4')
  })

  it('should render the correct details for a place that is currently closed', () => {
    cy.get('input#address').type('Fredrikinkatu 22, Helsinki')
    cy.get('button').contains('Etsi kahvilat').click()
    cy.get('#places-list').find('.place-item').should('have.length', 2).first().next().as('placeItem')
    cy.get('@placeItem').find('.place-details').as('placeDetails')
    cy.get('@placeItem').find('.place-icon img').should('exist')
    cy.get('@placeItem').find('.place-name').contains('Brooklyn Cafe')
    cy.get('@placeItem').find('.place-address').contains('Fredrikinkatu 19, Helsinki')
    cy.get('@placeDetails').find('.place-open-now').contains('kiinni')
    cy.get('@placeDetails').find('.place-distance').contains('300 m')
    cy.get('@placeDetails').find('.place-rating').contains('4.5')
  })

  describe('Geolocation API disabled', () => {
    it('should leave the address field initially empty', () => {
      cy.get('input#address').should('have.value', '')
    })

    it('should fetch address data and auto-complete the user-typed address', () => {
      cy.intercept('GET', '**/find-address?address=Fredrikinkatu%2022,%20Helsinki').as('fetchAddress')
      cy.get('input#address').type('Fredrikinkatu 22, Helsinki')
      cy.get('button').contains('Etsi kahvilat').click()
      cy.wait('@fetchAddress').its('response.body.results').should('have.length', 1)
      cy.get('input#address').should('have.value', 'Fredrikinkatu 22, 00120 Helsinki, Suomi')
    })
  })

  describe('Geolocation API enabled', () => {
    const latitude = 60.1580323
    const longitude = 24.9352637
    const addressUrl = `**/find-address?latitude=${latitude}&longitude=${longitude}`
    const placesUrl = `**/find-places?keyword=coffee&latitude=${latitude}&longitude=${longitude}&radius=500&type=cafe`

    beforeEach(() => {
      cy.reload()
      cy.intercept('GET', addressUrl).as('fetchAddress')
      cy.intercept('GET', placesUrl).as('fetchPlaces')

      cy.visit('/places', {
        onBeforeLoad(window) {
          cy.stub(window.navigator.geolocation, 'getCurrentPosition').callsFake(cb => {
            return cb({ coords: { latitude, longitude } })
          })
        },
      })
    })

    it('should automatically fetch address data and fill the address field', () => {
      cy.wait('@fetchAddress').its('response.body.results').should('have.length', 1)
      cy.get('input#address').should('have.value', 'Perämiehenkatu 1, 00150 Helsinki, Suomi')
    })

    it('should automatically fetch and render places data using the default distance', () => {
      cy.wait('@fetchPlaces').its('response.body.results').should('have.length', 1)
      cy.get('#places-list').find('.place-item').should('have.length', 2)
    })
  })
})
