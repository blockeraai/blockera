/// <reference types="Cypress" />
/**
 * External dependencies
 */
import { nanoid } from 'nanoid';

/**
 * Internal dependencies.
 */
import BoxPositionControl from '../index';
import { getControlValue } from '../../../store/selectors';
import { absolutePositionValues } from './data/absolute-position-values';

describe('box position control component testing', () => {
	beforeEach(() => {
		// run these tests as if in a desktop
		// browser with a 720p monitor
		cy.viewport(1280, 720);
	});

	describe('default', () => {
		it('should display custom label', () => {
			cy.withDataProvider({
				component: <BoxPositionControl label="My Label" />,
			});

			cy.getByDataCy('label-control').should('contain', 'My Label');
		});
		it('should display default value', () => {
			const name = nanoid();
			const defaultValue = {
				type: 'relative',
				position: {
					top: '9px',
					right: '78px',
					bottom: '23px',
					left: '-10px',
				},
			};
			cy.withDataProvider({
				component: (
					<BoxPositionControl
						label="My Label"
						defaultValue={defaultValue}
					/>
				),
				name,
			});

			cy.get('.publisher-control-select').click();
			cy.get('ul > li').contains('Relative').click();

			// Check data provider value!
			cy.then(() => {
				return expect(getControlValue(name)).to.deep.eq(defaultValue);
			});
		});

		it('should when box position value is changed, then context data provider value to changed!', () => {
			const onChangeMock = cy.stub().as('onChangeMock');
			const name = nanoid();
			cy.withDataProvider({
				component: (
					<BoxPositionControl
						label="My Label"
						onChange={onChangeMock}
					/>
				),
				name,
			});

			cy.get('.publisher-control-select').click();
			cy.get('ul > li').contains('Relative').click();
			cy.get('@onChangeMock').should('have.been.called');

			// Check data provider value!
			cy.then(() => {
				return expect(getControlValue(name).type).to.eq('relative');
			});
		});

		it('should display data with data id', () => {
			const name = nanoid();
			const Value = {
				type: 'relative',
				position: {
					top: '9px',
					right: '78px',
					bottom: '23px',
					left: '-10px',
				},
			};
			cy.withDataProvider({
				component: (
					<BoxPositionControl label="My Label" id="data.myData" />
				),
				value: {
					data: {
						myData: Value,
					},
				},
				name,
			});

			cy.get('.publisher-control-select').click();
			cy.get('ul > li').contains('Relative').click();

			// Check data provider value!
			cy.then(() => {
				return expect(getControlValue(name).data.myData).to.deep.eq(
					Value
				);
			});
		});

		it('should must add custom class name', () => {
			cy.withDataProvider({
				component: (
					<BoxPositionControl
						label="My Label"
						className="custom-class"
					/>
				),
			});

			cy.getByDataCy('box-position-control').should(
				'have.class',
				'custom-class'
			);
		});

		it('should display and render suggestion values', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: (
					<BoxPositionControl
						label="My Label"
						className="custom-class"
					/>
				),
				name,
			});
			cy.get('.publisher-control-select').click();
			cy.get('ul > li').contains('Relative').click();

			cy.get(
				'span[aria-label="Top Position"][data-cy="label-control"]'
			).click();

			cy.getByDataCy('set-0').click();
			// Check data provider value!
			cy.then(() => {
				const expectValue = '0px';
				return expect(getControlValue(name).position.top).to.eq(
					expectValue
				);
			});

			cy.getByDataCy('set-10').click();
			// Check data provider value!
			cy.then(() => {
				const expectValue = '10px';
				return expect(getControlValue(name).position.top).to.eq(
					expectValue
				);
			});

			cy.getByDataCy('set-20').click();
			// Check data provider value!
			cy.then(() => {
				const expectValue = '20px';
				return expect(getControlValue(name).position.top).to.eq(
					expectValue
				);
			});

			cy.getByDataCy('set-30').click();
			// Check data provider value!
			cy.then(() => {
				const expectValue = '30px';
				return expect(getControlValue(name).position.top).to.eq(
					expectValue
				);
			});

			cy.getByDataCy('set-60').click();
			// Check data provider value!
			cy.then(() => {
				const expectValue = '60px';
				return expect(getControlValue(name).position.top).to.eq(
					expectValue
				);
			});

			cy.getByDataCy('set-80').click();
			// Check data provider value!
			cy.then(() => {
				const expectValue = '80px';
				return expect(getControlValue(name).position.top).to.eq(
					expectValue
				);
			});

			cy.getByDataCy('set-100').click();
			// Check data provider value!
			cy.then(() => {
				const expectValue = '100px';
				return expect(getControlValue(name).position.top).to.eq(
					expectValue
				);
			});

			cy.getByDataCy('set-120').click();
			// Check data provider value!
			cy.then(() => {
				const expectValue = '120px';
				return expect(getControlValue(name).position.top).to.eq(
					expectValue
				);
			});
		});

		it('Labels', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: (
					<BoxPositionControl
						label="My Label"
						className="custom-class"
					/>
				),
				name,
			});
			cy.get('.publisher-control-select').click();
			cy.get('ul > li').contains('Relative').click();

			const positions = [
				'Top Position',
				'Right Position',
				'Bottom Position',
				'Left Position',
			];

			positions.forEach((position) => {
				cy.get(
					`span[aria-label="${position}"][data-cy="label-control"]`
				).as('Position');

				cy.get('@Position').click();
				cy.get('input[type=number]').clear();
				cy.get('input[type=number]').type(10);
				cy.get('@Position').contains(/^10$/);

				//
				// Change to EM
				//
				cy.get('[aria-label="Select Unit"]').select('em');
				cy.get('@Position')
					.invoke('text')
					.then((text) => {
						expect(text.trim()).to.eq('10em');
					});

				//
				// Change to CSS Func
				//
				cy.get('[aria-label="Select Unit"]').select('func', {
					force: true,
				});
				cy.get('input[type=text]').type('calc(10px + 10px)');
				cy.get('@Position')
					.invoke('text')
					.then((text) => {
						expect(text.trim()).to.eq('CSS');
					});
			});
		});
	});

	describe('relative - fixed - sticky', () => {
		it('should create new position', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <BoxPositionControl label="My Label" />,
				name,
			});

			cy.get('.publisher-control-select').click();
			cy.get('ul > li').contains('Relative').click();

			// add top position
			cy.get(
				'span[aria-label="Top Position"][data-cy="label-control"]'
			).click();
			cy.get('input[type=range]').setSliderValue(80);

			// add top right
			cy.get(
				'span[aria-label="Right Position"][data-cy="label-control"]'
			).click();
			cy.get('input[type=range]').setSliderValue(81);

			// add top bottom
			cy.get(
				'span[aria-label="Bottom Position"][data-cy="label-control"]'
			).click();
			cy.get('input[type=range]').setSliderValue(82);

			// add top left
			cy.get(
				'span[aria-label="Left Position"][data-cy="label-control"]'
			).click();
			cy.get('input[type=range]').setSliderValue(83);

			const expectValue = {
				type: 'relative',
				position: {
					top: '80px',
					right: '81px',
					bottom: '82px',
					left: '83px',
				},
			};

			// Check data provider value!
			cy.then(() => {
				return expect(getControlValue(name)).to.deep.eq(expectValue);
			});
		});
	});

	describe('absolute', () => {
		it('should render the suggestion absolute positions', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <BoxPositionControl label="My Label" />,
				name,
			});

			cy.get('.publisher-control-select').click();
			cy.get('ul > li').contains('Absolute').click();

			// check absolute top left
			cy.getByDataCy('absolute-top-left').click();
			// Check data provider value!
			cy.then(() => {
				return expect(getControlValue(name)).to.deep.eq(
					absolutePositionValues.topLeft
				);
			});

			// check absolute top right
			cy.getByDataCy('absolute-top-right').click();
			// Check data provider value!
			cy.then(() => {
				return expect(getControlValue(name)).to.deep.eq(
					absolutePositionValues.topRight
				);
			});

			// check absolute bottom left
			cy.getByDataCy('absolute-bottom-left').click();
			// Check data provider value!
			cy.then(() => {
				return expect(getControlValue(name)).to.deep.eq(
					absolutePositionValues.bottomLeft
				);
			});

			// check absolute bottom right
			cy.getByDataCy('absolute-bottom-right').click();
			// Check data provider value!
			cy.then(() => {
				return expect(getControlValue(name)).to.deep.eq(
					absolutePositionValues.bottomRight
				);
			});

			// check absolute top
			cy.getByDataCy('absolute-top').click();
			// Check data provider value!
			cy.then(() => {
				return expect(getControlValue(name)).to.deep.eq(
					absolutePositionValues.top
				);
			});

			// check absolute right
			cy.getByDataCy('absolute-right').click();
			// Check data provider value!
			cy.then(() => {
				return expect(getControlValue(name)).to.deep.eq(
					absolutePositionValues.right
				);
			});

			// check absolute bottom
			cy.getByDataCy('absolute-bottom').click();
			// Check data provider value!
			cy.then(() => {
				return expect(getControlValue(name)).to.deep.eq(
					absolutePositionValues.bottom
				);
			});

			// check absolute left
			cy.getByDataCy('absolute-left').click();
			// Check data provider value!
			cy.then(() => {
				return expect(getControlValue(name)).to.deep.eq(
					absolutePositionValues.left
				);
			});

			// check absolute full
			cy.getByDataCy('absolute-full').click();
			// Check data provider value!
			cy.then(() => {
				return expect(getControlValue(name)).to.deep.eq(
					absolutePositionValues.full
				);
			});

			// check absolute center
			cy.getByDataCy('absolute-center').click();
			// Check data provider value!
			cy.then(() => {
				return expect(getControlValue(name)).to.deep.eq(
					absolutePositionValues.center
				);
			});
		});
	});

	describe('sticky', () => {
		it('should render the suggestion for sticky position', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <BoxPositionControl label="My Label" />,
				name,
			});

			cy.get('.publisher-control-select').click();
			cy.get('ul > li').contains('Sticky').click();

			// check sticky to top
			cy.getByDataCy('stick-to-top').click();
			cy.then(() => {
				return expect(getControlValue(name)).to.deep.eq({
					type: 'sticky',
					position: {
						top: '0px',
						right: '',
						bottom: '',
						left: '',
					},
				});
			});

			// check sticky to bottom
			cy.getByDataCy('stick-to-bottom').click();
			cy.then(() => {
				return expect(getControlValue(name)).to.deep.eq({
					type: 'sticky',
					position: {
						top: '',
						right: '',
						bottom: '0px',
						left: '',
					},
				});
			});
		});
	});
});
