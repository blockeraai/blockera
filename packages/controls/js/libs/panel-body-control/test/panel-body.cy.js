import PanelBodyControl from '..';
import InheritIcon from '../stories/icons/inherit';

const panelTitle = 'Panel Title';
const panelBodyText = 'Panel Body';

describe('Panel Body Control', () => {
	beforeEach(() => {
		cy.viewport(1280, 720);
	});
	context('Default', () => {
		it('renders panel title, arrow.', () => {
			cy.withInspector(
				<PanelBodyControl title={panelTitle}>
					<p>{panelBodyText}</p>
				</PanelBodyControl>
			);
			cy.get('.components-panel__body-title').as('header');
			cy.get('@header').contains(panelTitle);
			cy.get('@header').find('.components-panel__arrow');
		});

		it('should be open by default', () => {
			cy.withInspector(
				<PanelBodyControl title={panelTitle}>
					<p>{panelBodyText}</p>
				</PanelBodyControl>
			);
			cy.contains(panelBodyText);
		});

		it('user can close and open the panel body', () => {
			cy.withInspector(
				<PanelBodyControl title={panelTitle}>
					<p>{panelBodyText}</p>
				</PanelBodyControl>
			);
			cy.get('.components-panel__body-toggle').click();
			cy.contains(panelBodyText).should('not.exist');

			cy.get('.components-panel__body-toggle').click();
			cy.contains(panelBodyText).should('exist');
		});

		it('calls onToggle eventHandler when opening and closing the panel', () => {
			const onToggleMock = cy.stub().as('onToggleMock');
			cy.withInspector(
				<PanelBodyControl title={panelTitle} onToggle={onToggleMock}>
					<p>{panelBodyText}</p>
				</PanelBodyControl>
			);
			cy.get('.components-panel__body-toggle').click();
			cy.get('@onToggleMock').should('have.been.called');
		});
	});

	context('Icon', () => {
		it('renders icon correctly', () => {
			cy.withInspector(
				<PanelBodyControl title={panelTitle} icon={<InheritIcon />}>
					<p>{panelBodyText}</p>
				</PanelBodyControl>
			);

			cy.get('.components-panel__icon').find('svg');
		});
	});

	context('Changed indicator', () => {
		it('No change', () => {
			cy.withInspector(
				<PanelBodyControl title={panelTitle}>
					<p>{panelBodyText}</p>
				</PanelBodyControl>
			);

			cy.get('.components-panel__body-title').within(() => {
				cy.getByDataTest('change-indicator').should('not.exist');
				cy.getByDataTest('primary-change-indicator').should(
					'not.exist'
				);
				cy.getByDataTest('states-change-indicator').should('not.exist');
			});
		});

		it('Primary changed', () => {
			cy.withInspector(
				<PanelBodyControl title={panelTitle} isChanged={true}>
					<p>{panelBodyText}</p>
				</PanelBodyControl>
			);

			cy.get('.components-panel__body-title').within(() => {
				cy.getByDataTest('change-indicator').should('exist');
				cy.getByDataTest('primary-change-indicator').should('exist');
				cy.getByDataTest('states-change-indicator').should('not.exist');
			});
		});

		it('States changed', () => {
			cy.withInspector(
				<PanelBodyControl
					title={panelTitle}
					isChanged={false}
					isChangedOnStates={true}
				>
					<p>{panelBodyText}</p>
				</PanelBodyControl>
			);

			cy.get('.components-panel__body-title').within(() => {
				cy.getByDataTest('change-indicator').should('exist');
				cy.getByDataTest('primary-change-indicator').should(
					'not.exist'
				);
				cy.getByDataTest('states-change-indicator').should('exist');
			});
		});

		it('Both changed', () => {
			cy.withInspector(
				<PanelBodyControl
					title={panelTitle}
					isChanged={true}
					isChangedOnStates={true}
				>
					<p>{panelBodyText}</p>
				</PanelBodyControl>
			);

			cy.get('.components-panel__body-title').within(() => {
				cy.getByDataTest('change-indicator').should('exist');
				cy.getByDataTest('primary-change-indicator').should('exist');
				cy.getByDataTest('states-change-indicator').should('exist');
			});
		});
	});
});
