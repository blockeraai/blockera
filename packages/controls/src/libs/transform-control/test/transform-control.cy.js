import { TransformControl } from '../../..';
import { getControlValue } from '../../../store/selectors';
import { STORE_NAME } from '../../repeater-control/store';

describe('Transform Control', () => {
	const contextDefaultValue = {
		type: 'move',
		'move-x': '0px',
		'move-y': '0px',
		'move-z': '0px',
		scale: '100%',
		'rotate-x': '0deg',
		'rotate-y': '0deg',
		'rotate-z': '0deg',
		'skew-x': '0deg',
		'skew-y': '0deg',
		isVisible: true,
	};

	beforeEach(() => {
		cy.viewport(1280, 720);
	});

	context('Functional Tests', () => {
		it('click on transform item must open and close the setting popover.', () => {
			const name = 'transform-control-f1';
			cy.withDataProvider({
				component: (
					<TransformControl popoverLabel="test popover title" />
				),
				value: [contextDefaultValue],
				store: STORE_NAME,
				name,
			});

			cy.get('[aria-label="Item 1"]').click();
			cy.contains('test popover title');
			cy.get('[aria-label="Item 1"]').click();
			cy.contains('test popover title').should('not.exist');
		});

		context('Move', () => {
			it('X,Y,Z changes correctly by entering number in their input', () => {
				const name = 'transform-control-move1';

				cy.withDataProvider({
					component: <TransformControl />,
					value: [contextDefaultValue],
					store: STORE_NAME,
					name,
				});

				cy.get('[aria-label="Item 1"]').click();

				cy.get('input[type="number"]').each(($input, idx) => {
					cy.wrap($input).type('20');
					cy.getByDataCy('repeater-item').then(($el) => {
						// visual assertion
						const textArr = $el.text().split(' ');
						expect(...textArr[idx].match(/\d+/)).to.be.equal('20');

						// data assertion
						const items = ['move-x', 'move-y', 'move-z'];
						expect(
							getControlValue(name, STORE_NAME)[0][items[idx]]
						).to.be.equal('20px');
					});
				});
			});

			it('X,Y,Z changes correctly by dragging their range', () => {
				const name = 'transform-control-move2';

				cy.withDataProvider({
					component: <TransformControl />,
					value: [contextDefaultValue],
					store: STORE_NAME,
					name,
				});

				cy.get('[aria-label="Item 1"]').click();
				cy.get('input[type="range"]').each(($range, idx) => {
					cy.wrap($range).invoke('val', '2001').trigger('change');

					cy.getByDataCy('repeater-item').then(($el) => {
						const textArr = $el.text().split(' ');

						// visual assertion
						expect(...textArr[idx].match(/\d+/)).to.be.equal('300');

						// data assertion
						const items = ['move-x', 'move-y', 'move-z'];
						expect(
							getControlValue(name, STORE_NAME)[0][items[idx]]
						).to.be.equal('300px');
					});
				});
			});
		});

		context('Scale', () => {
			it('scale changes correctly by entering number in its input.', () => {
				const name = 'transform-control-scale1';

				cy.withDataProvider({
					component: <TransformControl />,
					value: [contextDefaultValue],
					store: STORE_NAME,
					name,
				});

				cy.get('[aria-label="Item 1"]').click();
				cy.get('[aria-label="Scale"]').click();

				cy.get('input[type="number"]').clear();
				cy.get('input[type="number"]').type('150');

				// visual assertion
				cy.getByDataCy('repeater-item')
					.contains('150')
					.then(() => {
						// data assertion
						expect(
							getControlValue(name, STORE_NAME)[0].scale
						).to.be.equal('150%');
					});
			});

			it('scale changes correctly by dragging the range input', () => {
				const name = 'transform-control-scale2';
				cy.withDataProvider({
					component: <TransformControl />,
					value: [contextDefaultValue],
					store: STORE_NAME,
					name,
				});

				cy.get('[aria-label="Item 1"]').click();
				cy.get('[aria-label="Scale"]').eq(0).click();

				cy.get('input[type="range"]')
					.invoke('val', '2001')
					.trigger('change');

				// visual assertion
				cy.getByDataCy('repeater-item')
					.contains('200')
					.then(() => {
						// data assertion
						expect(
							getControlValue(name, STORE_NAME)[0].scale
						).to.be.equal('200%');
					});
			});
		});
		context('Rotate', () => {
			it('X,Y,Z changes correctly by entering number in their input', () => {
				const name = 'transform-control-rotate1';
				cy.withDataProvider({
					component: <TransformControl />,
					value: [contextDefaultValue],
					store: STORE_NAME,
					name,
				});

				cy.get('[aria-label="Item 1"]').click();
				cy.get('[aria-label="Rotate"]').click();

				cy.get('input[type="number"]').each(($input, idx) => {
					cy.wrap($input).type('20');
					cy.getByDataCy('repeater-item').then(($el) => {
						// visual assertion
						const textArr = $el.text().split(' ');
						expect(...textArr[idx].match(/\d+/)).to.be.equal('20');

						// data assertion
						const items = ['rotate-x', 'rotate-y', 'rotate-z'];
						expect(
							getControlValue(name, STORE_NAME)[0][items[idx]]
						).to.be.equal('20deg');
					});
				});
			});

			it('X,Y,Z changes correctly by dragging their range', () => {
				const name = 'transform-control-rotate2';
				cy.withDataProvider({
					component: <TransformControl />,
					value: [contextDefaultValue],
					store: STORE_NAME,
					name,
				});

				cy.get('[aria-label="Item 1"]').click();
				cy.get('[aria-label="Rotate"]').click();

				cy.get('input[type="range"]').each(($range, idx) => {
					cy.wrap($range).invoke('val', '2001').trigger('change');

					cy.getByDataCy('repeater-item').then(($el) => {
						const textArr = $el.text().split(' ');

						// visual assertion
						expect(...textArr[idx].match(/\d+/)).to.be.equal('180');

						// data assertion
						const items = ['rotate-x', 'rotate-y', 'rotate-z'];
						expect(
							getControlValue(name, STORE_NAME)[0][items[idx]]
						).to.be.equal('180deg');
					});
				});
			});
		});
		context('Skew', () => {
			it('X,Y changes correctly by entering number in their input', () => {
				const name = 'transform-control-skew1';
				cy.withDataProvider({
					component: <TransformControl />,
					value: [contextDefaultValue],
					store: STORE_NAME,
					name,
				});

				cy.get('[aria-label="Item 1"]').click();
				cy.get('[aria-label="Skew"]').click();

				cy.get('input[type="number"]').each(($input, idx) => {
					cy.wrap($input).clear();
					cy.wrap($input).type('20');
					cy.getByDataCy('repeater-item').then(($el) => {
						// visual assertion
						const textArr = $el.text().split(' ');
						expect(...textArr[idx].match(/\d+/)).to.be.equal('20');

						// data assertion
						const items = ['skew-x', 'skew-y', 'skew-z'];
						expect(
							getControlValue(name, STORE_NAME)[0][items[idx]]
						).to.be.equal('20deg');
					});
				});
			});

			it('X,Y changes correctly by dragging their range', () => {
				const name = 'transform-control-skew2';
				cy.withDataProvider({
					component: <TransformControl />,
					value: [contextDefaultValue],
					store: STORE_NAME,
					name,
				});

				cy.get('[aria-label="Item 1"]').click();
				cy.get('[aria-label="Skew"]').click();

				cy.get('input[type="range"]').each(($range, idx) => {
					cy.wrap($range).invoke('val', '2001').trigger('change');

					cy.getByDataCy('repeater-item').then(($el) => {
						const textArr = $el.text().split(' ');

						// visual assertion
						expect(...textArr[idx].match(/\d+/)).to.be.equal('60');

						// data assertion
						const items = ['skew-x', 'skew-y'];
						expect(
							getControlValue(name, STORE_NAME)[0][items[idx]]
						).to.be.equal('60deg');
					});
				});
			});
		});
	});

	context('Initial Value Tests', () => {
		const componentDefaultValue = {
			type: 'move',
			'move-x': '50px',
			'move-y': '50px',
			'move-z': '50px',
			scale: '120%',
			'rotate-x': '0deg',
			'rotate-y': '90deg',
			'rotate-z': '45deg',
			'skew-x': '30deg',
			'skew-y': '20deg',
			isVisible: true,
		};

		// 1.
		it('calculated data must be defaultValue, when defaultValue(ok) && id(!ok) value(undefined)', () => {
			const name = 'transform-control-initial1';
			cy.withDataProvider({
				component: (
					<TransformControl defaultValue={[componentDefaultValue]} />
				),
				value: undefined,
				store: STORE_NAME,
				name,
			});

			cy.getByDataCy('repeater-item').then(($el) => {
				const textArr = $el.text().split(' ');
				textArr.forEach((text) => {
					expect(...text.match(/\d+/)).to.be.equal('50');
				});
			});
		});

		// 2.
		it('calculated defaultValue must be value, when defaultValue(ok) && id(!ok) && value(ok)', () => {
			const name = 'transform-control-initial2';
			cy.withDataProvider({
				component: (
					<TransformControl
						defaultValue={[componentDefaultValue]}
						id="x.y"
					/>
				),
				value: [contextDefaultValue],
				store: STORE_NAME,
				name,
			});

			cy.getByDataCy('repeater-item').then(($el) => {
				const textArr = $el.text().split(' ');
				textArr.forEach((text) => {
					expect(...text.match(/\d+/)).to.be.equal('0');
				});
			});
		});

		// 3.
		it('calculated data must be defaultValue, when defaultValue(ok) && id(ok) && value(undefined)', () => {
			const name = 'transform-control-initial3';
			cy.withDataProvider({
				component: (
					<TransformControl
						id="x[0].b[0].c"
						defaultValue={[componentDefaultValue]}
					/>
				),
				value: {
					x: [
						{
							b: [
								{
									c: undefined,
								},
							],
						},
					],
				},
				store: STORE_NAME,
				name,
			});

			cy.getByDataCy('repeater-item').then(($el) => {
				const textArr = $el.text().split(' ');
				textArr.forEach((text) => {
					expect(...text.match(/\d+/)).to.be.equal('50');
				});
			});
		});

		// 4.
		it('calculated data must be value, when id(!ok), defaultValue(!ok), value(root)', () => {
			const name = 'transform-control-initial4';
			cy.withDataProvider({
				component: <TransformControl />,
				value: [contextDefaultValue],
				store: STORE_NAME,
				name,
			});

			cy.getByDataCy('repeater-item').then(($el) => {
				const textArr = $el.text().split(' ');
				textArr.forEach((text) => {
					expect(...text.match(/\d+/)).to.be.equal('0');
				});
			});
		});
	});
});
