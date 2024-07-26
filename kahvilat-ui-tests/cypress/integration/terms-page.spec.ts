/// <reference types="cypress" />

context('Terms Page', () => {
  beforeEach(() => {
    cy.reload()
    cy.visit('/terms')
  })

  it('should have a document title', () => {
    cy.title().should('include', 'kahvilat.app')
  })

  it('should render a title', () => {
    cy.get('main > h2').contains('Terms of service')
  })

  it('should render the terms of service', () => {
    cy.get('main > p').should('have.length', 2).contains('This service')
  })

  it('should render the footer', () => {
    cy.get('footer > ul > a').should('have.length', 2).as('footerLinks')
    cy.get('@footerLinks').first().contains('Privacy statement')
    cy.get('@footerLinks').first().next().contains('Terms of service')
    cy.get('footer > p').contains(`© ${new Date().getFullYear()} Purelogic Softworks`)
  })
})
