/// <reference types="cypress" />

context('Landing Page', () => {
  beforeEach(() => {
    cy.reload()
    cy.visit('/')
  })

  it('should have a document title', () => {
    cy.title().should('include', 'kahvilat.app')
  })

  it('should render the logo', () => {
    cy.get('header > svg').should('exist')
  })

  it('should render the title', () => {
    cy.get('header > p').contains('Varhainen versio nyt kokeiltavissa.')
  })

  it('should render a button that navigates to the places page', () => {
    cy.get('header > a > button').contains('Kokeile nyt').click()
    cy.location('pathname').should('include', '/places')
    cy.go('back')
    cy.location('pathname').should('not.include', '/places')
  })

  it('should render the footer', () => {
    cy.get('footer > ul > a').should('have.length', 2).as('footerLinks')
    cy.get('@footerLinks').first().contains('Privacy statement')
    cy.get('@footerLinks').first().next().contains('Terms of service')
    cy.get('footer > p').contains(`© ${new Date().getFullYear()} Purelogic Softworks`)
  })
})
