import { ChangeIndicator } from '../..';
import { getControlValue } from '../../../store/selectors';

describe('Change indicator component', () => {
	beforeEach(() => {
		cy.viewport(1280, 720);
	});

	it('should not show indicator if no props provided (disable by default)', () => {
		cy.withDataProvider({
			component: <ChangeIndicator />,
		});

		cy.getByDataTest('change-indicator').should('not.exist');
	});

	it('should not show indicator if props provided', () => {
		cy.withDataProvider({
			component: (
				<ChangeIndicator isChanged={false} isChangedOnStates={false} />
			),
		});

		cy.getByDataTest('change-indicator').should('not.exist');
	});

	it('only primary changed', () => {
		cy.withDataProvider({
			component: (
				<ChangeIndicator isChanged={true} isChangedOnStates={false} />
			),
		});

		cy.getByDataTest('primary-change-indicator').should('exist');
		cy.getByDataTest('states-change-indicator').should('not.exist');
	});

	it('only states changed', () => {
		cy.withDataProvider({
			component: (
				<ChangeIndicator isChanged={false} isChangedOnStates={true} />
			),
		});

		cy.getByDataTest('primary-change-indicator').should('not.exist');
		cy.getByDataTest('states-change-indicator').should('exist');
	});

	it('Both changed', () => {
		cy.withDataProvider({
			component: (
				<ChangeIndicator isChanged={true} isChangedOnStates={true} />
			),
		});

		cy.getByDataTest('primary-change-indicator').should('exist');
		cy.getByDataTest('states-change-indicator').should('exist');
	});
});
