import PositionButtonControl from '..';
import { nanoid } from 'nanoid';
import { getControlValue } from '../../../store/selectors';
import { controlReducer } from '../../../store/reducers/control-reducer';
import { modifyControlValue } from '../../../store/actions';
import { select } from '@wordpress/data';

describe('position-button-control component testing', () => {
	beforeEach(() => {
		cy.viewport(1280, 720);
	});

	context('rendering test', () => {
		it('should render correctly, when passing no props', () => {
			cy.withDataProvider({
				component: <PositionButtonControl />,
			});

			cy.getByDataTest('position-button').should('exist');
			cy.getByDataTest('position-icon-custom').should('exist');
		});

		it('should render correctly, when passing defaultValue', () => {
			cy.withDataProvider({
				component: (
					<PositionButtonControl
						defaultValue={{ top: '50%', left: '50%' }}
					/>
				),
			});

			//Check icon
			cy.getByDataTest('position-icon-center-center').should('exist');
			//Check color
			cy.getByDataTest('position-button')
				.invoke('attr', 'style')
				.should('include', '--publisher-controls-color');
		});

		it('should render correctly, when passing label', () => {
			cy.withDataProvider({
				component: (
					<PositionButtonControl
						label="Label for button"
						popoverLabel="Title for popover"
						alignmentMatrixLabel="Alignment matrix field"
					/>
				),
			});

			cy.getByDataTest('position-button').click();
			// cy.contains('Label for button');
			cy.contains('Title for popover').should('exist');
			cy.contains('Alignment matrix field').should('exist');
		});

		it('should render icon correctly, when select top-left position', () => {
			cy.withDataProvider({
				component: <PositionButtonControl />,
			});

			cy.getByDataTest('position-button').click();
			cy.getByDataTest('popover-body').within(() => {
				cy.contains('top left').click({ force: true });
			});

			//Check icon
			cy.getByDataTest('position-icon-top-left').should('exist');
		});

		it('should render icon correctly, when select top-center position', () => {
			cy.withDataProvider({
				component: <PositionButtonControl />,
			});

			cy.getByDataTest('position-button').click();
			cy.getByDataTest('popover-body').within(() => {
				cy.contains('top center').click({ force: true });
			});

			//Check icon
			cy.getByDataTest('position-icon-top-center').should('exist');
		});

		it('should render icon correctly, when select top-right position', () => {
			cy.withDataProvider({
				component: <PositionButtonControl />,
			});

			cy.getByDataTest('position-button').click();
			cy.getByDataTest('popover-body').within(() => {
				cy.contains('top right').click({ force: true });
			});

			//Check icon
			cy.getByDataTest('position-icon-top-right').should('exist');
		});

		it('should render icon correctly, when select center-left position', () => {
			cy.withDataProvider({
				component: <PositionButtonControl />,
			});

			cy.getByDataTest('position-button').click();
			cy.getByDataTest('popover-body').within(() => {
				cy.contains('center left').click({ force: true });
			});

			//Check icon
			cy.getByDataTest('position-icon-center-left').should('exist');
		});

		it('should render icon correctly, when select center-center position', () => {
			cy.withDataProvider({
				component: <PositionButtonControl />,
			});

			cy.getByDataTest('position-button').click();
			cy.getByDataTest('popover-body').within(() => {
				cy.contains('center center').click({ force: true });
			});

			//Check icon
			cy.getByDataTest('position-icon-center-center').should('exist');
		});

		it('should render icon correctly, when select center-right position', () => {
			cy.withDataProvider({
				component: <PositionButtonControl />,
			});

			cy.getByDataTest('position-button').click();
			cy.getByDataTest('popover-body').within(() => {
				cy.contains('center right').click({ force: true });
			});

			//Check icon
			cy.getByDataTest('position-icon-center-right').should('exist');
		});

		it('should render icon correctly, when select bottom-left position', () => {
			cy.withDataProvider({
				component: <PositionButtonControl />,
			});

			cy.getByDataTest('position-button').click();
			cy.getByDataTest('popover-body').within(() => {
				cy.contains('bottom left').click({ force: true });
			});

			//Check icon
			cy.getByDataTest('position-icon-bottom-left').should('exist');
		});

		it('should render icon correctly, when select bottom-center  position', () => {
			cy.withDataProvider({
				component: <PositionButtonControl />,
			});

			cy.getByDataTest('position-button').click();
			cy.getByDataTest('popover-body').within(() => {
				cy.contains('bottom center').click({ force: true });
			});

			//Check icon
			cy.getByDataTest('position-icon-bottom-center').should('exist');
		});

		it('should render icon correctly, when select bottom-right  position', () => {
			cy.withDataProvider({
				component: <PositionButtonControl />,
			});

			cy.getByDataTest('position-button').click();
			cy.getByDataTest('popover-body').within(() => {
				cy.contains('bottom right').click({ force: true });
			});

			//Check icon
			cy.getByDataTest('position-icon-bottom-right').should('exist');
		});

		it('should render icon correctly, when add custom position', () => {
			cy.withDataProvider({
				component: <PositionButtonControl />,
			});

			cy.getByDataTest('position-button').click();
			cy.getByDataTest('popover-body').within(() => {
				cy.get('input').eq(0).type(10);
				cy.get('input').eq(1).type(20);
			});

			//Check icon
			cy.getByDataTest('position-icon-custom').should('exist');
		});
	});

	context('interaction test', () => {
		it('should update data correctly, when interacting', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <PositionButtonControl />,
				name,
			});

			cy.getByDataTest('position-button').click();
			cy.getByDataTest('popover-body').within(() => {
				cy.contains('center center').click({ force: true });
			});

			//Check data provider value
			cy.get('body').then(() => {
				expect({ top: '50%', left: '50%' }).to.be.deep.equal(
					getControlValue(name)
				);
			});
		});

		it('should update button color, when interacting', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <PositionButtonControl />,
				name,
			});

			cy.getByDataTest('position-button').click();
			cy.getByDataTest('popover-body').within(() => {
				cy.contains('center center').click({ force: true });
			});

			//Check color
			cy.getByDataTest('position-button')
				.invoke('attr', 'style')
				.should(
					'include',
					'var(--publisher-controls-border-color-focus)'
				);
		});

		it('should onChange be called, when interacting', () => {
			const name = nanoid();
			const defaultProps = {
				onChange: (value) => {
					controlReducer(
						select('publisher-core/controls').getControl(name),
						modifyControlValue({
							value,
							controlId: name,
						})
					);
				},
			};
			cy.stub(defaultProps, 'onChange').as('onChange');

			cy.withDataProvider({
				component: <PositionButtonControl {...defaultProps} />,
				name,
			});

			cy.getByDataTest('position-button').click();
			cy.getByDataTest('popover-body').within(() => {
				cy.contains('top left').click({ force: true });
			});

			cy.get('@onChange').should('have.been.called');
		});
	});
});
