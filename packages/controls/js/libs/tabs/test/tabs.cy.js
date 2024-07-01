/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { Tabs } from '../index';

describe('Tabs Component testing', () => {
	context('Tabs', () => {
		beforeEach(() => {
			const tabs = [
				{
					name: 'general',
					title: 'General',
					className: 'general-tab',
					icon: (
						<Icon
							library="ui"
							icon="gear"
							data-test={'blockera-tab-icon'}
						/>
					),
				},
				{
					name: 'style',
					title: 'Style',
					className: 'style-tab',
					icon: (
						<Icon
							library="wp"
							icon="styles"
							data-test={'blockera-tab-icon'}
						/>
					),
				},
			];

			cy.withInspector(
				<Tabs tabs={tabs} getPanel={(tab) => tab.title} />
			);
		});

		it('should render all tabs requested', () => {
			cy.get('button').contains('Style').click();
			cy.get('button').contains('General').click();
		});

		it('should render two number tab', () => {
			cy.get('button').should(($button) => {
				expect($button).to.have.length(2);
			});
		});

		it('should change tab panel with select any tab!', () => {
			cy.get('button').contains('Style').click();

			cy.get('[role="tabpanel"]').contains('Style');

			cy.get('button').contains('General').click();

			cy.get('[role="tabpanel"]').contains('General');
		});

		it('should not render icon and just accessible with tab names', () => {
			const tabs = [
				{
					name: 'general',
					title: 'General',
					className: 'general-tab',
				},
				{
					name: 'style',
					title: 'Style',
					className: 'style-tab',
				},
			];

			cy.withInspector(
				<Tabs tabs={tabs} getPanel={(tab) => tab.title} />
			);

			cy.get('svg').should(($svg) => {
				expect($svg).to.have.length(0);
			});

			cy.get('button').contains('Style').click();
			cy.getByDataTest('style-tab').should('have.class', 'is-active-tab');
			cy.get('button').contains('General').click();
			cy.getByDataTest('general-tab').should(
				'have.class',
				'is-active-tab'
			);
		});

		it('should render panel when change tab and check expect components on the active panel.', () => {
			const tabs = [
				{
					name: 'general',
					title: 'General',
					className: 'general-tab',
				},
				{
					name: 'style',
					title: 'Style',
					className: 'style-tab',
				},
			];

			cy.withInspector(
				<Tabs
					tabs={tabs}
					getPanel={(tab) => {
						return (
							<div>
								<h1 data-test={`${tab.name}-tab`}>
									<strong>{tab.title}</strong>
								</h1>
							</div>
						);
					}}
				/>
			);

			cy.getByDataTest('general-tab').should('exist');

			cy.get('button').contains('Style').click();

			cy.getByDataTest('style-tab').should('exist');
		});
	});
});
