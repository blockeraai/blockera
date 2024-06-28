/**
 * External dependencies
 */
import { nanoid } from 'nanoid';

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
			component: (
				<BoxSpacingControl
					label="My Label"
					defaultValue={defaultValue}
				/>
			),
			name,
		});

		cy.get(
			'span[aria-label="Top Margin"][data-cy="label-control"]'
		).click();

		cy.getByDataCy('box-spacing-set-10').click();

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
				<BoxSpacingControl label="My Label" onChange={onChangeMock} />
			),
			name,
		});

		cy.get(
			'span[aria-label="Top Margin"][data-cy="label-control"]'
		).click();
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

		cy.get(
			'span[aria-label="Top Margin"][data-cy="label-control"]'
		).click();
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
		cy.get(
			'span[aria-label="Top Margin"][data-cy="label-control"]'
		).click();

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
		cy.get(
			'span[aria-label="Top Margin"][data-cy="label-control"]'
		).click();
		cy.get('input[type=range]').setSliderValue(80);

		// add top right margin
		cy.get(
			'span[aria-label="Right Margin"][data-cy="label-control"]'
		).click();
		cy.get('input[type=range]').setSliderValue(81);

		// add top bottom margin
		cy.get(
			'span[aria-label="Bottom Margin"][data-cy="label-control"]'
		).click();
		cy.get('input[type=range]').setSliderValue(82);

		// add top left margin
		cy.get(
			'span[aria-label="Left Margin"][data-cy="label-control"]'
		).click();
		cy.get('input[type=range]').setSliderValue(83);

		// add top padding
		cy.get(
			'span[aria-label="Top Padding"][data-cy="label-control"]'
		).click();
		cy.get('input[type=range]').setSliderValue(80);

		// add top right padding
		cy.get(
			'span[aria-label="Right Padding"][data-cy="label-control"]'
		).click();
		cy.get('input[type=range]').setSliderValue(81);

		// add top bottom padding
		cy.get(
			'span[aria-label="Bottom Padding"][data-cy="label-control"]'
		).click();
		cy.get('input[type=range]').setSliderValue(82);

		// add top left padding
		cy.get(
			'span[aria-label="Left Padding"][data-cy="label-control"]'
		).click();
		cy.get('input[type=range]').setSliderValue(83);

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

	it('Labels', () => {
		const name = nanoid();
		cy.withDataProvider({
			component: <BoxSpacingControl label="My Label" />,
			name,
		});

		const items = [
			'Top Margin',
			'Right Margin',
			'Bottom Margin',
			'Left Margin',
			'Top Padding',
			'Right Padding',
			'Bottom Padding',
			'Left Padding',
		];

		items.forEach((item) => {
			cy.get(`span[aria-label="${item}"][data-cy="label-control"]`).as(
				'Position'
			);

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
					expect(text.trim().replace(item, '')).to.eq('10em');
				});

			//
			// Change to Auto (only in margin)
			//
			if (
				[
					'Top Margin',
					'Right Margin',
					'Bottom Margin',
					'Left Margin',
				].includes(item)
			) {
				cy.get('[aria-label="Select Unit"]').select('auto');
				cy.get('@Position')
					.invoke('text')
					.then((text) => {
						expect(text.trim().replace(item, '')).to.eq('AUTO');
					});
			}

			//
			// Change to CSS Func
			//
			cy.get('[aria-label="Select Unit"]').select('func');
			cy.get('input[type=text]').clear();
			cy.get('input[type=text]').type('calc(10px + 10px)');
			cy.get('@Position')
				.invoke('text')
				.then((text) => {
					expect(text.trim().replace(item, '')).to.eq('CSS');
				});
		});
	});
});
