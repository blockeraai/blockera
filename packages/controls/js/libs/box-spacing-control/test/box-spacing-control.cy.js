/**
 * External dependencies
 */
import { nanoid } from 'nanoid';

/**
 * Blockera dependencies.
 */
import { openBoxSpacingSide } from '@blockera/dev-cypress/js/helpers';

/**
 * Internal dependencies.
 */
import BoxSpacingControl from '../index';
import { getControlValue } from '../../../store/selectors';

describe('box spacing control component testing', () => {
	beforeEach(() => {
		// run these tests as if in a desktop
		// browser with a 720p monitor
		cy.viewport(1280, 720);
	});

	it('should display custom label', () => {
		cy.withDataProvider({
			component: <BoxSpacingControl label="My Label" />,
		});

		cy.getByDataCy('label-control').should('contain', 'My Label');
	});

	it('should display default value', () => {
		const name = nanoid();
		cy.withDataProvider({
			component: (
				<BoxSpacingControl
					label="My Label"
					defaultValue={{
						margin: {
							top: '10px',
							right: '78px',
							bottom: '23px',
							left: '-10px',
						},
						padding: {
							top: '9px',
							right: '78px',
							bottom: '23px',
							left: '-10px',
						},
					}}
					marginLock={'none'}
					paddingLock={'none'}
				/>
			),
			name,
		});

		openBoxSpacingSide('margin-top');

		cy.getByDataCy('box-spacing-set-10').click();

		// Check data provider value!
		cy.then(() => {
			return expect(getControlValue(name)).to.deep.eq({
				margin: {
					top: '10px',
					right: '78px',
					bottom: '23px',
					left: '-10px',
				},
				padding: {
					top: '9px',
					right: '78px',
					bottom: '23px',
					left: '-10px',
				},
			});
		});
	});

	it('should when box position value is changed, then context data provider value to changed!', () => {
		const onChangeMock = cy.stub().as('onChangeMock');
		const name = nanoid();
		cy.withDataProvider({
			component: (
				<BoxSpacingControl label="My Label" onChange={onChangeMock} />
			),
			name,
		});

		openBoxSpacingSide('margin-top');

		cy.getByDataCy('box-spacing-set-10').click();
		cy.get('@onChangeMock').should('have.been.called');

		// Check data provider value!
		cy.then(() => {
			return expect(getControlValue(name).margin.top).to.eq('10px');
		});
	});

	it('should display data with data id', () => {
		const name = nanoid();
		const defaultValue = {
			margin: {
				top: '10px',
				right: '78px',
				bottom: '23px',
				left: '-10px',
			},
			padding: {
				top: '9px',
				right: '78px',
				bottom: '23px',
				left: '-10px',
			},
		};
		cy.withDataProvider({
			component: <BoxSpacingControl label="My Label" id="data.myData" />,
			value: {
				data: {
					myData: defaultValue,
				},
			},
			name,
		});

		openBoxSpacingSide('margin-top');
		cy.getByDataCy('box-spacing-set-10').click();

		// Check data provider value!
		cy.then(() => {
			return expect(getControlValue(name).data.myData).to.deep.eq(
				defaultValue
			);
		});
	});

	it('should must add custom class name', () => {
		cy.withDataProvider({
			component: (
				<BoxSpacingControl label="My Label" className="custom-class" />
			),
		});

		cy.getByDataCy('box-spacing-control').should(
			'have.class',
			'custom-class'
		);
	});

	it('should display and render suggestion values', () => {
		const name = nanoid();
		cy.withDataProvider({
			component: (
				<BoxSpacingControl label="My Label" className="custom-class" />
			),
			name,
		});

		openBoxSpacingSide('margin-top');

		cy.getByDataCy('box-spacing-set-auto').click();
		// Check data provider value!
		cy.then(() => {
			const expectValue = 'auto';
			return expect(getControlValue(name).margin.top).to.eq(expectValue);
		});

		cy.getByDataCy('box-spacing-set-0').click();
		// Check data provider value!
		cy.then(() => {
			const expectValue = '0px';
			return expect(getControlValue(name).margin.top).to.eq(expectValue);
		});

		cy.getByDataCy('box-spacing-set-10').click();
		// Check data provider value!
		cy.then(() => {
			const expectValue = '10px';
			return expect(getControlValue(name).margin.top).to.eq(expectValue);
		});

		cy.getByDataCy('box-spacing-set-20').click();
		// Check data provider value!
		cy.then(() => {
			const expectValue = '20px';
			return expect(getControlValue(name).margin.top).to.eq(expectValue);
		});

		cy.getByDataCy('box-spacing-set-30').click();
		// Check data provider value!
		cy.then(() => {
			const expectValue = '30px';
			return expect(getControlValue(name).margin.top).to.eq(expectValue);
		});

		cy.getByDataCy('box-spacing-set-60').click();
		// Check data provider value!
		cy.then(() => {
			const expectValue = '60px';
			return expect(getControlValue(name).margin.top).to.eq(expectValue);
		});

		cy.getByDataCy('box-spacing-set-80').click();
		// Check data provider value!
		cy.then(() => {
			const expectValue = '80px';
			return expect(getControlValue(name).margin.top).to.eq(expectValue);
		});

		cy.getByDataCy('box-spacing-set-100').click();
		// Check data provider value!
		cy.then(() => {
			const expectValue = '100px';
			return expect(getControlValue(name).margin.top).to.eq(expectValue);
		});

		cy.getByDataCy('box-spacing-set-120').click();
		// Check data provider value!
		cy.then(() => {
			const expectValue = '120px';
			return expect(getControlValue(name).margin.top).to.eq(expectValue);
		});
	});

	it('should create new spacing', () => {
		const name = nanoid();
		cy.withDataProvider({
			component: <BoxSpacingControl label="My Label" />,
			name,
		});

		// add top margin
		openBoxSpacingSide('margin-top');
		cy.get('input[type=number]').clear();
		cy.get('input[type=number]').type(80, { force: true });

		// add top right margin
		openBoxSpacingSide('margin-right');
		cy.get('input[type=number]').clear();
		cy.get('input[type=number]').type(81, { force: true });

		// add top bottom margin
		openBoxSpacingSide('margin-bottom');
		cy.get('input[type=number]').clear();
		cy.get('input[type=number]').type(82, { force: true });

		// add top left margin
		openBoxSpacingSide('margin-left');
		cy.get('input[type=number]').clear();
		cy.get('input[type=number]').type(83, { force: true });

		// add top padding
		openBoxSpacingSide('padding-top');
		cy.get('input[type=number]').clear();
		cy.get('input[type=number]').type(80, { force: true });

		// add top right padding
		openBoxSpacingSide('padding-right');
		cy.get('input[type=number]').clear();
		cy.get('input[type=number]').type(81, { force: true });

		// add top bottom padding
		openBoxSpacingSide('padding-bottom');
		cy.get('input[type=number]').clear();
		cy.get('input[type=number]').type(82, { force: true });

		// add top left padding
		openBoxSpacingSide('padding-left');
		cy.get('input[type=number]').clear();
		cy.get('input[type=number]').type(83, { force: true });

		const expectValue = {
			margin: {
				top: '80px',
				right: '81px',
				bottom: '82px',
				left: '83px',
			},
			padding: {
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
