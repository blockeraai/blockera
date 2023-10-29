import { AttributesControl } from '../../..';
import { nanoid } from 'nanoid';
import { STORE_NAME } from '../../repeater-control/store';
import { select } from '@wordpress/data';
import { modifyControlValue } from '../../../store/actions';
import { controlReducer } from '../../../store/reducers/control-reducer';
import { getControlValue } from '../../../store/selectors';

describe('attributes-control component testing', () => {
	describe('general(default)', () => {
		const defaultProps = {
			label: 'Attributes Control',
			popoverLabel: 'Popover',
		};

		it('render correctly without default value', () => {
			cy.viewport(1000, 1000);
			cy.withDataProvider({
				component: <AttributesControl {...defaultProps} />,
				value: [],
				store: STORE_NAME,
			});

			cy.contains('Attributes Control');
		});

		it('render correctly with default value', () => {
			cy.viewport(1000, 1000);
			cy.withDataProvider({
				component: <AttributesControl />,
				value: [{ key: '', __key: '', value: '', isVisible: true }],
				store: STORE_NAME,
			});

			cy.get('[aria-label="Item 1"]').should('exist');
		});

		it('render correctly with false isVisible ', () => {
			cy.viewport(1000, 1000);
			cy.withDataProvider({
				component: <AttributesControl />,
				value: [{ key: '', __key: '', value: '', isVisible: false }],
				store: STORE_NAME,
			});

			cy.get('[aria-label="Item 1"]')
				.parent()
				.parent()
				.parent()
				.should('have.class', 'is-inactive');
		});

		describe('test interaction :', () => {
			it('add data', () => {
				cy.viewport(1000, 1000);
				const name = nanoid();
				cy.withDataProvider({
					component: <AttributesControl {...defaultProps} />,
					value: [{ key: '', __key: '', value: '', isVisible: true }],
					store: STORE_NAME,
					name,
				});

				cy.get('[aria-label="Item 1"]').click();
				cy.contains('Popover').as('popover');
				cy.get('@popover').get('input').first().type('data-test');
				cy.get('@popover').get('input').last().type('test value');

				cy.get('[aria-label="Item 1"]').should('include.text', 'test');
				cy.get('[aria-label="Item 1"]').should(
					'include.text',
					'test value'
				);

				//Check data provide value
				cy.get('[aria-label="Item 1"]').then(() => {
					expect([
						{
							key: 'data-test',
							__key: '',
							value: 'test value',
							isVisible: true,
						},
					]).to.be.deep.equal(getControlValue(name, STORE_NAME));
				});
			});

			it('add one more repeater', () => {
				cy.viewport(1000, 1000);
				const name = nanoid();
				cy.withDataProvider({
					component: (
						<AttributesControl
							{...defaultProps}
							onChange={(value) => {
								controlReducer(
									select(
										'publisher-core/controls'
									).getControl(name),
									modifyControlValue({
										value,
										controlId: name,
									})
								);
							}}
						/>
					),
					value: [{ key: '', __key: '', value: '', isVisible: true }],
					store: STORE_NAME,
					name,
				});

				cy.get('[aria-label="Add New Popover"]').click();
				cy.get('[aria-label="Item 2"]').should('exist');

				//Check data provide value
				cy.get('[aria-label="Item 2"]').then(() => {
					expect(2).to.be.deep.equal(
						getControlValue(name, STORE_NAME).length
					);
				});
			});

			it('does onChange fire?', () => {
				const name = nanoid();
				const propsToPass = {
					...defaultProps,
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

				cy.stub(propsToPass, 'onChange').as('onChange');
				cy.withDataProvider({
					component: <AttributesControl {...propsToPass} />,
					value: [{ key: '', __key: '', value: '', isVisible: true }],
					store: STORE_NAME,
					name,
				});

				cy.get('[aria-label="Item 1"]').click();

				cy.get('input').focused().type('dummy text');

				cy.get('@onChange').should('have.been.called');
			});
		});
	});

	describe('a', () => {
		const defaultProps = {
			label: 'A Tag',
			popoverLabel: 'Popover',
			attributeElement: 'a',
		};

		it('render correctly without default value', () => {
			cy.viewport(1000, 1000);
			cy.withDataProvider({
				component: <AttributesControl {...defaultProps} />,
				value: [],
				store: STORE_NAME,
			});

			cy.contains('A Tag');
		});

		it('render correctly with default value ,(default attribute:none)', () => {
			cy.viewport(1000, 1000);
			cy.withDataProvider({
				component: <AttributesControl {...defaultProps} />,
				value: [{ key: '', __key: '', value: '', isVisible: true }],
				store: STORE_NAME,
			});

			cy.get('[aria-label="Item 1"]').should('exist');

			// check attribute value
			cy.get('[aria-label="Item 1"]').click();
			cy.contains('Popover')
				.parent()
				.find('input')
				.should('not.have.length');
		});

		describe('test interaction :', () => {
			it('change to custom + add data', () => {
				cy.viewport(1000, 1000);
				const name = nanoid();
				cy.withDataProvider({
					component: <AttributesControl {...defaultProps} />,
					value: [{ key: '', __key: '', value: '', isVisible: true }],
					store: STORE_NAME,
					name,
				});

				cy.get('[aria-label="Item 1"]').click();
				cy.contains('Popover').as('popover');
				cy.get('@popover').get('select').select('custom');

				cy.get('@popover').get('input').first().type('custom key');
				cy.get('@popover').get('input').last().type('custom value');

				cy.get('[aria-label="Item 1"]').should(
					'include.text',
					'custom key'
				);
				cy.get('[aria-label="Item 1"]').should(
					'include.text',
					'custom value'
				);

				//Check data provide value
				cy.get('[aria-label="Item 1"]').then(() => {
					expect([
						{
							key: 'custom key',
							__key: 'custom',
							value: 'custom value',
							isVisible: true,
						},
					]).to.be.deep.equal(getControlValue(name, STORE_NAME));
				});
			});

			it('change to rel + add data', () => {
				cy.viewport(1000, 1000);
				const name = nanoid();
				cy.withDataProvider({
					component: <AttributesControl {...defaultProps} />,
					value: [{ key: '', __key: '', value: '', isVisible: true }],
					store: STORE_NAME,
					name,
				});

				cy.get('[aria-label="Item 1"]').click();
				cy.contains('Popover').as('popover');
				cy.get('@popover').get('select').select('rel');

				cy.get('@popover').get('select').last().select('sponsored');

				cy.get('[aria-label="Item 1"]').should('include.text', 'rel');
				cy.get('[aria-label="Item 1"]').should(
					'include.text',
					'sponsored'
				);

				//	Check data provide value
				cy.get('[aria-label="Item 1"]').then(() => {
					expect([
						{
							key: 'rel',
							__key: 'rel',
							value: 'sponsored',
							isVisible: true,
						},
					]).to.be.deep.equal(getControlValue(name, STORE_NAME));
				});
			});

			it('change to target + add data', () => {
				cy.viewport(1000, 1000);
				const name = nanoid();
				cy.withDataProvider({
					component: <AttributesControl {...defaultProps} />,
					value: [{ key: '', __key: '', value: '', isVisible: true }],
					store: STORE_NAME,
					name,
				});

				cy.get('[aria-label="Item 1"]').click();
				cy.contains('Popover').as('popover');
				cy.get('@popover').get('select').select('target');

				cy.get('@popover').get('select').last().select('_self');

				cy.get('[aria-label="Item 1"]').should(
					'include.text',
					'target'
				);
				cy.get('[aria-label="Item 1"]').should('include.text', '_self');

				//Check data provide value
				cy.get('[aria-label="Item 1"]').then(() => {
					expect([
						{
							key: 'target',
							__key: 'target',
							value: '_self',
							isVisible: true,
						},
					]).to.be.deep.equal(getControlValue(name, STORE_NAME));
				});
			});

			it('change to hreflang + add data', () => {
				cy.viewport(1000, 1000);
				const name = nanoid();
				cy.withDataProvider({
					component: <AttributesControl {...defaultProps} />,
					value: [{ key: '', __key: '', value: '', isVisible: true }],
					store: STORE_NAME,
					name,
				});
				cy.get('[aria-label="Item 1"]').click();
				cy.contains('Popover').as('popover');
				cy.get('@popover').get('select').select('hreflang');
				cy.get('@popover').get('input').type('hreflang value');

				cy.get('[aria-label="Item 1"]').should(
					'include.text',
					'hreflang'
				);
				cy.get('[aria-label="Item 1"]').should(
					'include.text',
					'hreflang value'
				);

				//Check data provider value
				cy.get('[aria-label="Item 1"]').then(() => {
					expect([
						{
							key: 'hreflang',
							__key: 'hreflang',
							value: 'hreflang value',
							isVisible: true,
						},
					]).to.be.deep.equal(getControlValue(name, STORE_NAME));
				});
			});

			it('change to referrerpolicy + add data', () => {
				cy.viewport(1000, 1000);
				const name = nanoid();
				cy.withDataProvider({
					component: <AttributesControl {...defaultProps} />,
					value: [{ key: '', __key: '', value: '', isVisible: true }],
					store: STORE_NAME,
					name,
				});

				cy.get('[aria-label="Item 1"]').click();
				cy.contains('Popover').as('popover');
				cy.get('@popover').get('select').select('referrerpolicy');

				cy.get('@popover').get('select').last().select('origin');

				cy.get('[aria-label="Item 1"]').should(
					'include.text',
					'referrerpolicy'
				);
				cy.get('[aria-label="Item 1"]').should(
					'include.text',
					'origin'
				);

				//Check data provide value
				cy.get('[aria-label="Item 1"]').then(() => {
					expect([
						{
							key: 'referrerpolicy',
							__key: 'referrerpolicy',
							value: 'origin',
							isVisible: true,
						},
					]).to.be.deep.equal(getControlValue(name, STORE_NAME));
				});
			});
		});
	});

	describe('button', () => {
		const defaultProps = {
			label: 'Button',
			popoverLabel: 'Popover',
			attributeElement: 'button',
		};

		it('render correctly without default value', () => {
			cy.viewport(1000, 1000);
			cy.withDataProvider({
				component: <AttributesControl {...defaultProps} />,
				value: [],
				store: STORE_NAME,
			});

			cy.contains('Button');
		});

		it('render correctly with default value ,(default attribute:none)', () => {
			cy.viewport(1000, 1000);
			cy.withDataProvider({
				component: <AttributesControl {...defaultProps} />,
				value: [{ key: '', __key: '', value: '', isVisible: true }],
				store: STORE_NAME,
			});

			cy.get('[aria-label="Item 1"]').should('exist');
			// check attribute value
			cy.get('[aria-label="Item 1"]').click();
			cy.contains('Popover')
				.parent()
				.find('input')
				.should('not.have.length');
		});

		describe('test interaction :', () => {
			it('change to custom + add data', () => {
				cy.viewport(1000, 1000);
				const name = nanoid();
				cy.withDataProvider({
					component: <AttributesControl {...defaultProps} />,
					value: [{ key: '', __key: '', value: '', isVisible: true }],
					store: STORE_NAME,
					name,
				});

				cy.get('[aria-label="Item 1"]').click();
				cy.contains('Popover').as('popover');
				cy.get('@popover').get('select').select('custom');

				cy.get('@popover').get('input').first().type('custom key');
				cy.get('@popover').get('input').last().type('custom value');

				cy.get('[aria-label="Item 1"]').should(
					'include.text',
					'custom key'
				);
				cy.get('[aria-label="Item 1"]').should(
					'include.text',
					'custom value'
				);

				//Check data provide value
				cy.get('[aria-label="Item 1"]').then(() => {
					expect([
						{
							key: 'custom key',
							__key: 'custom',
							value: 'custom value',
							isVisible: true,
						},
					]).to.be.deep.equal(getControlValue(name, STORE_NAME));
				});
			});

			it('change to type + add data', () => {
				cy.viewport(1000, 1000);
				const name = nanoid();
				cy.withDataProvider({
					component: <AttributesControl {...defaultProps} />,
					value: [{ key: '', __key: '', value: '', isVisible: true }],
					store: STORE_NAME,
					name,
				});

				cy.get('[aria-label="Item 1"]').click();
				cy.contains('Popover').as('popover');
				cy.get('@popover').get('select').select('type');

				cy.get('@popover').get('select').last().select('reset');

				cy.get('[aria-label="Item 1"]').should('include.text', 'type');
				cy.get('[aria-label="Item 1"]').should('include.text', 'reset');

				//Check data provide value
				cy.get('[aria-label="Item 1"]').then(() => {
					expect([
						{
							key: 'type',
							__key: 'type',
							value: 'reset',
							isVisible: true,
						},
					]).to.be.deep.equal(getControlValue(name, STORE_NAME));
				});
			});
		});
	});

	describe('ol', () => {
		const defaultProps = {
			label: 'Ol',
			popoverLabel: 'Popover',
			attributeElement: 'ol',
		};

		it('render correctly without default value', () => {
			cy.viewport(1000, 1000);
			cy.withDataProvider({
				component: <AttributesControl {...defaultProps} />,
				value: [],
				store: STORE_NAME,
			});

			cy.contains('Ol');
		});

		it('render correctly with default value ,(default attribute:none)', () => {
			cy.viewport(1000, 1000);
			cy.withDataProvider({
				component: <AttributesControl {...defaultProps} />,
				value: [{ key: '', __key: '', value: '', isVisible: true }],
				store: STORE_NAME,
			});

			cy.get('[aria-label="Item 1"]').should('exist');
			// check attribute value
			cy.get('[aria-label="Item 1"]').click();
			cy.contains('Popover')
				.parent()
				.find('input')
				.should('not.have.length');
		});

		describe('test interaction :', () => {
			it('change to custom + add data', () => {
				cy.viewport(1000, 1000);
				const name = nanoid();
				cy.withDataProvider({
					component: <AttributesControl {...defaultProps} />,
					value: [{ key: '', __key: '', value: '', isVisible: true }],
					store: STORE_NAME,
					name,
				});

				cy.get('[aria-label="Item 1"]').click();
				cy.contains('Popover').as('popover');
				cy.get('@popover').get('select').select('custom');

				cy.get('@popover').get('input').first().type('custom key');
				cy.get('@popover').get('input').last().type('custom value');

				cy.get('[aria-label="Item 1"]').should(
					'include.text',
					'custom key'
				);
				cy.get('[aria-label="Item 1"]').should(
					'include.text',
					'custom value'
				);

				//Check data provider value
				cy.get('[aria-label="Item 1"]').then(() => {
					expect([
						{
							key: 'custom key',
							__key: 'custom',
							value: 'custom value',
							isVisible: true,
						},
					]).to.be.deep.equal(getControlValue(name, STORE_NAME));
				});
			});

			it('change to type + add data', () => {
				cy.viewport(1000, 1000);
				const name = nanoid();
				cy.withDataProvider({
					component: <AttributesControl {...defaultProps} />,
					value: [{ key: '', __key: '', value: '', isVisible: true }],
					store: STORE_NAME,
					name,
				});

				cy.get('[aria-label="Item 1"]').click();
				cy.contains('Popover').as('popover');
				cy.get('@popover').get('select').select('type');

				cy.get('@popover').get('select').last().select('A');

				cy.get('[aria-label="Item 1"]').should('include.text', 'type');
				cy.get('[aria-label="Item 1"]').should('include.text', 'A');

				//Check data provider value
				cy.get('[aria-label="Item 1"]').then(() => {
					expect([
						{
							key: 'type',
							__key: 'type',
							value: 'A',
							isVisible: true,
						},
					]).to.be.deep.equal(getControlValue(name, STORE_NAME));
				});
			});

			it('change to start + add data', () => {
				cy.viewport(1000, 1000);
				const name = nanoid();
				cy.withDataProvider({
					component: <AttributesControl {...defaultProps} />,
					value: [{ key: '', __key: '', value: '', isVisible: true }],
					store: STORE_NAME,
					name,
				});

				cy.get('[aria-label="Item 1"]').click();
				cy.contains('Popover').as('popover');
				cy.get('@popover').get('select').select('start');

				cy.get('@popover').get('input').type('start value');

				cy.get('[aria-label="Item 1"]').should('include.text', 'start');
				cy.get('[aria-label="Item 1"]').should(
					'include.text',
					'start value'
				);

				//Check data provider value
				cy.get('[aria-label="Item 1"]').then(() => {
					expect([
						{
							key: 'start',
							__key: 'start',
							value: 'start value',
							isVisible: true,
						},
					]).to.be.deep.equal(getControlValue(name, STORE_NAME));
				});
			});

			it('change to reversed + add data', () => {
				cy.viewport(1000, 1000);
				const name = nanoid();
				cy.withDataProvider({
					component: <AttributesControl {...defaultProps} />,
					value: [{ key: '', __key: '', value: '', isVisible: true }],
					store: STORE_NAME,
					name,
				});

				cy.get('[aria-label="Item 1"]').click();
				cy.contains('Popover').as('popover');
				cy.get('@popover').get('select').select('reversed');

				cy.get('@popover').get('input').type('reversed value');

				cy.get('@popover');
				cy.get('[aria-label="Item 1"]').should(
					'include.text',
					'reversed'
				);
				cy.get('[aria-label="Item 1"]').should(
					'include.text',
					'reversed value'
				);

				//Check data provider value
				cy.get('[aria-label="Item 1"]').then(() => {
					expect([
						{
							key: 'reversed',
							__key: 'reversed',
							value: 'reversed value',
							isVisible: true,
						},
					]).to.be.deep.equal(getControlValue(name, STORE_NAME));
				});
			});
		});
	});

	describe('test useControlContext', () => {
		it('have default value, no value, no id', () => {
			cy.viewport(1000, 1000);
			cy.withDataProvider({
				component: (
					<AttributesControl
						defaultValue={[
							{
								key: 'default key',
								__key: '',
								value: 'default value',
								isVisible: true,
							},
						]}
					/>
				),
				store: STORE_NAME,
			});

			cy.get('[aria-label="Item 1"]').should(
				'include.text',
				'default key'
			);
			cy.get('[aria-label="Item 1"]').should(
				'include.text',
				'default value'
			);
		});

		it('have default value, no id, have value', () => {
			cy.viewport(1000, 1000);
			cy.withDataProvider({
				component: (
					<AttributesControl
						defaultValue={[
							{
								key: 'default key',
								__key: '',
								value: 'default',
								isVisible: true,
							},
						]}
					/>
				),
				store: STORE_NAME,
				value: [
					{
						key: 'value key',
						__key: '',
						value: 'value',
						isVisible: true,
					},
				],
			});

			cy.get('[aria-label="Item 1"]').should('include.text', 'value key');
			cy.get('[aria-label="Item 1"]').should('include.text', 'value');
		});

		// it.only('have default value, have invalid id,have value', () => {
		// 	cy.viewport(1000, 1000);
		// 	cy.withDataProvider({
		// 		component: (
		// 			<AttributesControl
		// 				defaultValue={[
		// 					{
		// 						key: 'default key',
		// 						__key: '',
		// 						value: 'default value',
		// 						isVisible: true,
		// 					},
		// 				]}
		// 				id={'[0].i'}
		// 			/>
		// 		),
		// 		store: STORE_NAME,
		// 		value: [{ repeater: [] }],
		// 	});

		// 	cy.get('[aria-label="Item 1"]').should(
		// 		'include.text',
		// 		'default key'
		// 	);
		// 	cy.get('[aria-label="Item 1"]').should(
		// 		'include.text',
		// 		'default value'
		// 	);
		// });

		it('no default value, no id, have value', () => {
			cy.viewport(1000, 1000);
			cy.withDataProvider({
				component: <AttributesControl />,
				store: STORE_NAME,
				value: [
					{
						key: 'default key',
						__key: '',
						value: 'default value',
						isVisible: true,
					},
				],
			});

			cy.get('[aria-label="Item 1"]').should(
				'include.text',
				'default key'
			);
			cy.get('[aria-label="Item 1"]').should(
				'include.text',
				'default value'
			);
		});
	});
});
