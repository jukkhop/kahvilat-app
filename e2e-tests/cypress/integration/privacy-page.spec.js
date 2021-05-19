/// <reference types="cypress" />

context('Privacy Page', () => {
  beforeEach(() => {
    cy.reload()
    cy.visit('/privacy')
  })

  it('should have a document title', () => {
    cy.title().should('include', 'kahvilat.app')
  })

  it('should render a title', () => {
    cy.get('main > h2').contains('Privacy statement')
  })

  it('should render the privacy statement', () => {
    cy.get('main > p').should('have.length', 1).contains('This service')
  })

  it('should render the footer', () => {
    cy.get('footer > ul > a').should('have.length', 2).as('footerLinks')
    cy.get('@footerLinks').first().contains('Privacy statement')
    cy.get('@footerLinks').first().next().contains('Terms of service')
    cy.get('footer > p').contains('© 2020 Purelogic Softworks')
  })
})
