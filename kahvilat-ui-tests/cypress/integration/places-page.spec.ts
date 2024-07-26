/// <reference types="cypress" />

context('Places Page', () => {
  beforeEach(() => {
    cy.reload()
    cy.visit('/places')
  })

  describe('Layout', () => {
    it('should have a document title', () => {
      cy.title().should('include', 'kahvilat.app')
    })

    it('should render the header including the logo image', () => {
      cy.get('header').should('exist')
      cy.get('header > svg').invoke('attr', 'data-icon').should('equal', 'mug-saucer')
    })

    it('should render the main element', () => {
      cy.get('main').should('exist')
    })

    it('should render the footer', () => {
      cy.get('footer').should('exist')
      cy.get('footer > ul > a').should('have.length', 2).as('footerLinks')
      cy.get('@footerLinks').first().contains('Privacy statement')
      cy.get('@footerLinks').first().next().contains('Terms of service')
      cy.get('footer > p').contains(`© ${new Date().getFullYear()} Purelogic Softworks`)
    })
  })

  describe('Content', () => {
    it('should render the form', () => {
      cy.get('main form').should('exist')
    })

    it('should render the address label and input', () => {
      cy.get('form #address-label').contains('Osoite')
      cy.get('form #address-field').find('input').should('exist')
    })

    it('should render the distance label and input', () => {
      cy.get('form #label-for-distance').contains('Etäisyys')
      cy.get('form input[name=distance]').should('exist')

      cy.get('form .MuiSlider-markLabel').each(el => {
        cy.wrap(el).invoke('text').should('be.oneOf', ['250 m', '500 m', '750 m', '1 km', '1250 m', '1500 m'])
      })
    })

    it('should render the submit button', () => {
      cy.get('form > button').contains('Etsi kahvilat').should('exist')
    })

    it('should render the instruction message', () => {
      cy.get('main > p').contains('Anna osoite ja klikkaa "ETSI KAHVILAT" aloittaaksesi.')
    })

    it('should render the places map', () => {
      cy.get('form #address-field').find('input').type('Fredrikinkatu 22, Helsinki')
      cy.get('form button').contains('Etsi kahvilat').click()
      cy.get('main #places-map').should('exist')
    })

    it('should render the places list', () => {
      cy.get('form #address-field').find('input').type('Fredrikinkatu 22, Helsinki')
      cy.get('form button').contains('Etsi kahvilat').click()
      cy.get('main #places-list').should('exist')
    })
  })

  describe('Functionality', () => {
    it('should fetch and render the correct amount of places', () => {
      const placesUrl = '**/place?keyword=coffee&latitude=60.1631932&longitude=24.93846&radius=250&type=cafe'
      const morePlacesUrl = '**/place?cursor=token2'
      cy.intercept('GET', placesUrl).as('fetchPlaces')
      cy.intercept('GET', morePlacesUrl).as('fetchMorePlaces')
      cy.get('#address-field').find('input').type('Fredrikinkatu 22, Helsinki')
      cy.get('#distance-field').find('span').contains('250 m').click()
      cy.get('button').contains('Etsi kahvilat').click()
      cy.wait('@fetchPlaces').its('response.body.items').should('have.length', 1)
      cy.wait('@fetchMorePlaces').its('response.body.items').should('have.length', 1)
      cy.get('#places-list').find('.place-item').should('have.length', 2)
    })

    it('should fetch and render the correct amount of places, given a larger distance', () => {
      const placesUrl = '**/place?keyword=coffee&latitude=60.1631932&longitude=24.93846&radius=750&type=cafe'
      const morePlacesUrl = '**/place?cursor=token1'
      cy.intercept('GET', placesUrl).as('fetchPlaces')
      cy.intercept('GET', morePlacesUrl).as('fetchMorePlaces')
      cy.get('#address-field').find('input').type('Fredrikinkatu 22, Helsinki')
      cy.get('#distance-field').find('span').contains('750 m').click()
      cy.get('button').contains('Etsi kahvilat').click()
      cy.wait('@fetchPlaces').its('response.body.items').should('have.length', 3)
      cy.wait('@fetchMorePlaces').its('response.body.items').should('have.length', 3)
      cy.get('#places-list').find('.place-item').should('have.length', 6)
    })

    it('should re-fetch places when selecting a different address', () => {
      const placesUrl1 = '**/place?keyword=coffee&latitude=60.1631932&longitude=24.93846&radius=500&type=cafe'
      const placesUrl2 = '**/place?keyword=coffee&latitude=60.1580323&longitude=24.9352637&radius=500&type=cafe'
      cy.intercept('GET', placesUrl1).as('fetchPlaces1')
      cy.intercept('GET', placesUrl2).as('fetchPlaces2')
      cy.get('#address-field').find('input').type('Fredrikinkatu 22, Helsinki')
      cy.get('button').contains('Etsi kahvilat').click()
      cy.wait('@fetchPlaces1').its('response.body.items').should('have.length', 1)
      cy.get('#places-list').find('.place-address').should('have.length', 2).first().contains('Fredrikinkatu')
      cy.get('#address-field').find('input').clear().type('Perämiehenkatu 1, Helsinki')
      cy.get('button').contains('Etsi kahvilat').click()
      cy.wait('@fetchPlaces2').its('response.body.items').should('have.length', 1)
      cy.get('#places-list').find('.place-address').should('have.length', 2).last().contains('Perämiehenkatu')
    })

    it('should re-fetch places when selecting a different distance', () => {
      const placesUrl1 = '**/place?keyword=coffee&latitude=60.1631932&longitude=24.93846&radius=250&type=cafe'
      const placesUrl2 = '**/place?keyword=coffee&latitude=60.1631932&longitude=24.93846&radius=500&type=cafe'
      cy.intercept('GET', placesUrl1).as('fetchPlaces1')
      cy.intercept('GET', placesUrl2).as('fetchPlaces2')
      cy.get('#address-field').find('input').type('Fredrikinkatu 22, Helsinki')
      cy.get('#distance-field').find('span').contains('250 m').click()
      cy.get('button').contains('Etsi kahvilat').click()
      cy.wait('@fetchPlaces1').its('response.body.items').should('have.length', 1)
      cy.get('#distance-field').find('span').contains('500 m').click()
      cy.get('button').contains('Etsi kahvilat').click()
      cy.wait('@fetchPlaces2').its('response.body.items').should('have.length', 1)
    })

    it('should render the correct details for a place that is currently open', () => {
      cy.get('#address-field').find('input').type('Fredrikinkatu 22, Helsinki')
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
      cy.get('#address-field').find('input').type('Fredrikinkatu 22, Helsinki')
      cy.get('button').contains('Etsi kahvilat').click()
      cy.get('#places-list').find('.place-item').should('have.length', 2).first().next().as('placeItem')
      cy.get('@placeItem').find('.place-details').as('placeDetails')
      cy.get('@placeItem').find('.place-icon img').should('exist')
      cy.get('@placeItem').find('.place-name').contains('Brooklyn Cafe')
      cy.get('@placeItem').find('.place-address').contains('Fredrikinkatu 19, Helsinki')
      cy.get('@placeDetails').find('.place-open-now').contains('suljettu')
      cy.get('@placeDetails').find('.place-distance').contains('300 m')
      cy.get('@placeDetails').find('.place-rating').contains('4.5')
    })

    describe('Status message', () => {
      const headers = { 'Access-Control-Allow-Credentials': 'true', 'Access-Control-Allow-Origin': '*' }
      const errorResponse = { statusCode: 500, body: { error: 'Something failed' }, headers, delayMs: 500 }
      const emptyResponse = { statusCode: 200, body: { items: [] }, headers, delayMs: 500 }

      it('should render an instruction message initially', () => {
        cy.get('main > p').contains('Anna osoite ja klikkaa "ETSI KAHVILAT" aloittaaksesi.')
      })

      it('should render a loading indicator when data is being fetched', () => {
        const url = '**/place?keyword=coffee&latitude=60.1631932&longitude=24.93846&radius=500&type=cafe'
        cy.intercept('GET', url).as('fetchPlaces')
        cy.get('#address-field').find('input').type('Fredrikinkatu 22, Helsinki')
        cy.get('button').contains('Etsi kahvilat').click()
        cy.get('svg[data-icon="spinner"]').should('exist')
        cy.wait('@fetchPlaces')
      })

      it('should render a generic error message when there is an error while fetching', () => {
        cy.intercept({ method: 'GET', url: '**/address?*' }, errorResponse).as('fetchAddress')
        cy.get('#address-field').find('input').type('Fredrikinkatu 22, Helsinki')
        cy.get('button').contains('Etsi kahvilat').click()
        cy.wait('@fetchAddress')
        cy.get('main > p').contains('Haussa tapahtui virhe.')
      })

      it('should render a specific error message when no address could be found', () => {
        cy.intercept({ method: 'GET', url: '**/address?*' }, emptyResponse).as('fetchAddress')
        cy.get('#address-field').find('input').type('Fredrikinkatu 22, Helsinki')
        cy.get('button').contains('Etsi kahvilat').click()
        cy.wait('@fetchAddress')
        cy.get('main > p').contains('Antamaasi osoitetta ei löytynyt.')
      })

      it('should render a specific error message when no places could be found', () => {
        cy.intercept({ method: 'GET', url: '**/place?*' }, emptyResponse).as('fetchPlaces')
        cy.get('#address-field').find('input').type('Fredrikinkatu 22, Helsinki')
        cy.get('button').contains('Etsi kahvilat').click()
        cy.wait('@fetchPlaces')
        cy.get('main > p').contains('Valitettavasti kahviloita ei löytynyt.')
      })
    })

    describe('Sorting of places', () => {
      it('should sort places primarily by openness, preferring open places over ones that are currently closed', () => {
        cy.get('#address-field').find('input').type('Fredrikinkatu 22, Helsinki')
        cy.get('#distance-field').find('span').contains('750 m').click()
        cy.get('button').contains('Etsi kahvilat').click()
        cy.get('#places-list .place-item').should('have.length', 6).as('placeItems')
        cy.get('@placeItems').first().find('.place-open-now').contains('auki')
        cy.get('@placeItems').last().find('.place-open-now').contains('suljettu')
      })

      it('should sort then by rating, preferring higher-rated places over lower-rated ones', () => {
        cy.get('#address-field').find('input').type('Fredrikinkatu 22, Helsinki')
        cy.get('#distance-field').find('span').contains('750 m').click()
        cy.get('button').contains('Etsi kahvilat').click()
        cy.get('#places-list .place-item').should('have.length', 6).as('placeItems')
        cy.get('@placeItems').first().next().find('.place-distance').contains('500 m')
        cy.get('@placeItems').first().next().find('.place-rating').contains('4.6')
        cy.get('@placeItems').last().prev().find('.place-distance').contains('500 m')
        cy.get('@placeItems').last().prev().find('.place-rating').contains('4.1')
      })

      it('should sort then by distance, preferring places that are closer over ones that are farther away', () => {
        cy.get('#address-field').find('input').type('Fredrikinkatu 22, Helsinki')
        cy.get('#distance-field').find('span').contains('750 m').click()
        cy.get('button').contains('Etsi kahvilat').click()
        cy.get('#places-list .place-item').should('have.length', 6).as('placeItems')
        cy.get('@placeItems').first().next().next().find('.place-rating').contains('4.4')
        cy.get('@placeItems').first().next().next().find('.place-distance').contains('100 m')
        cy.get('@placeItems').last().prev().prev().find('.place-rating').contains('4.4')
        cy.get('@placeItems').last().prev().prev().find('.place-distance').contains('600 m')
      })
    })

    describe('Geolocation API disabled', () => {
      it('should leave the address field initially empty', () => {
        cy.get('#address-field').find('input').should('have.value', '')
      })

      it('should fetch address data and auto-complete the user-typed address', () => {
        cy.intercept('GET', '**/address?address=Fredrikinkatu+22%2C+Helsinki').as('fetchAddress')
        cy.get('#address-field').find('input').type('Fredrikinkatu 22, Helsinki')
        cy.get('button').contains('Etsi kahvilat').click()
        cy.wait('@fetchAddress').its('response.body.items').should('have.length', 1)
        cy.get('#address-field').find('input').should('have.value', 'Fredrikinkatu 22, 00120 Helsinki, Suomi')
      })
    })

    describe('Geolocation API enabled', () => {
      const latitude = 60.1580323
      const longitude = 24.9352637
      const addressUrl = `**/address?latitude=${latitude}&longitude=${longitude}`

      beforeEach(() => {
        cy.reload()
        cy.intercept('GET', addressUrl).as('fetchAddress')

        cy.visit('/places', {
          onBeforeLoad(window) {
            cy.stub(window.navigator.geolocation, 'getCurrentPosition').callsFake(cb => {
              return cb({ coords: { latitude, longitude } })
            })
          },
        })
      })

      it('should automatically fetch address data and fill the address field', () => {
        cy.wait('@fetchAddress').its('response.body.items').should('have.length', 1)
        cy.get('#address-field').find('input').should('have.value', 'Perämiehenkatu 1, 00150 Helsinki, Suomi')
      })
    })
  })
})
