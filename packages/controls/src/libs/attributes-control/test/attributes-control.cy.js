import AttributesControl from '..';
import { nanoid } from 'nanoid';
import { STORE_NAME } from '../../repeater-control/store';
import { select } from '@wordpress/data';
import { modifyControlValue } from '../../../store/actions';
import { controlReducer } from '../../../store/reducers/control-reducer';
import { getControlValue } from '../../../store/selectors';

describe('attributes-control component testing', () => {
	describe('rendering test', () => {
		it('should render correctly with label', () => {
			cy.withDataProvider({
				component: <AttributesControl label="Attributes" />,
				value: [{ key: '', __key: '', value: '', isVisible: true }],
				store: STORE_NAME,
			});

			cy.contains('Attributes');
		});

		it('should render correctly with empty value', () => {
			cy.withDataProvider({
				component: <AttributesControl />,
				value: [],
				store: STORE_NAME,
			});

			cy.getByDataCy('group-control-header').should('not.exist');
		});

		it('should render correctly without value and defaultValue', () => {
			cy.withDataProvider({
				component: <AttributesControl />,
				store: STORE_NAME,
			});

			cy.getByDataCy('group-control-header').should('not.exist');
		});

		it('should render correctly with value', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <AttributesControl />,
				value: [{ key: '', __key: '', value: '', isVisible: true }],
				store: STORE_NAME,
				name,
			});
			cy.getByDataCy('group-control-header').should('exist');
		});

		it('should render correctly with defaultValue', () => {
			cy.withDataProvider({
				component: (
					<AttributesControl
						defaultValue={[
							{
								key: '',
								__key: '',
								value: '',
								isVisible: true,
							},
						]}
					/>
				),
				store: STORE_NAME,
			});

			cy.getByDataCy('group-control-header').should('exist');
		});

		it('should popover not be open at first rendering, when passing false to isOpen(default)', () => {
			cy.withDataProvider({
				component: (
					<AttributesControl popoverLabel="Attributes Popover" />
				),
				store: STORE_NAME,
				value: [{ key: '', __key: '', value: '', isOpen: false }],
			});

			cy.contains('Attributes Popover').should('not.exist');
		});

		it('should popover be open at first rendering, when passing true to isOpen', () => {
			cy.withDataProvider({
				component: (
					<AttributesControl popoverLabel="Attributes Popover" />
				),
				store: STORE_NAME,
				value: [{ key: '', __key: '', value: '', isOpen: true }],
			});

			cy.contains('Attributes Popover').should('exist');
		});

		it('should repeater item have is-active class, when passing true to isVisible(default)', () => {
			cy.withDataProvider({
				component: (
					<AttributesControl popoverLabel="Attributes Popover" />
				),
				store: STORE_NAME,
				value: [{ key: '', __key: '', value: '', isVisible: true }],
			});

			cy.getByDataCy('group-control-header')
				.parent()
				.parent()
				.should('have.class', 'is-active');
		});

		it('should repeater item have is-inactive class, when passing false to isVisible', () => {
			cy.withDataProvider({
				component: (
					<AttributesControl popoverLabel="Attributes Popover" />
				),
				store: STORE_NAME,
				value: [{ key: '', __key: '', value: '', isVisible: false }],
			});

			cy.getByDataCy('group-control-header')
				.parent()
				.parent()
				.should('have.class', 'is-inactive');
		});
	});

	describe('attributeElement is general(default)', () => {
		const defaultProps = {
			label: 'Attributes Control',
			popoverLabel: 'Popover',
		};

		describe('interaction test', () => {
			it('should context and local value be updated, when type key and value', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <AttributesControl {...defaultProps} />,
					value: [{ key: '', __key: '', value: '', isVisible: true }],
					store: STORE_NAME,
					name,
				});

				cy.getByDataCy('group-control-header').click();
				cy.contains('Popover').as('popover');
				cy.get('@popover').get('input').first().type('data-test');
				cy.get('@popover').get('input').last().type('test value');

				cy.getByDataCy('group-control-header').should(
					'include.text',
					'test'
				);
				cy.getByDataCy('group-control-header').should(
					'include.text',
					'test value'
				);

				//Check data provide value
				cy.getByDataCy('group-control-header').then(() => {
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

			it('should context value have length of 2, when adding one more item', () => {
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
				cy.getByDataCy('group-control-header').should(
					'have.length',
					'2'
				);

				//Check data provide value
				cy.getByDataCy('group-control-header').then(() => {
					expect(2).to.be.deep.equal(
						getControlValue(name, STORE_NAME).length
					);
				});
			});

			it('should onChange be called, when interacting', () => {
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

				cy.getByDataCy('group-control-header').click();

				cy.get('input').focused().type('dummy text');

				cy.get('@onChange').should('have.been.called');
			});
		});
	});

	describe('attributeElement is a', () => {
		const defaultProps = {
			label: 'A Tag',
			popoverLabel: 'Popover',
			attributeElement: 'a',
		};

		it('should render correctly value ,(default attribute:none)', () => {
			cy.withDataProvider({
				component: <AttributesControl {...defaultProps} />,
				value: [
					{
						key: '',
						__key: '',
						value: '',
						isVisible: true,
					},
				],
				store: STORE_NAME,
			});

			cy.getByDataCy('group-control-header').should('exist');

			//check attribute value
			cy.getByDataCy('group-control-header').click();
			cy.contains('Popover')
				.parent()
				.within(() => {
					cy.get('input').should('not.exist');
				});
		});

		describe('test interaction :', () => {
			it('should context and local value be updated, when select custom and add data', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <AttributesControl {...defaultProps} />,
					value: [{ key: '', __key: '', value: '', isVisible: true }],
					store: STORE_NAME,
					name,
				});

				cy.getByDataCy('group-control-header').click();
				cy.contains('Popover').as('popover');
				cy.get('@popover').get('select').select('custom');

				cy.get('@popover').get('input').first().type('custom key');
				cy.get('@popover').get('input').last().type('custom value');

				cy.getByDataCy('group-control-header').should(
					'include.text',
					'custom key'
				);
				cy.getByDataCy('group-control-header').should(
					'include.text',
					'custom value'
				);

				//Check data provide value
				cy.getByDataCy('group-control-header').then(() => {
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

			it('should context and local value be updated, when select rel and add data', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <AttributesControl {...defaultProps} />,
					value: [{ key: '', __key: '', value: '', isVisible: true }],
					store: STORE_NAME,
					name,
				});

				cy.getByDataCy('group-control-header').click();
				cy.contains('Popover').as('popover');
				cy.get('@popover').get('select').select('rel');

				cy.get('@popover').get('select').last().select('sponsored');

				cy.getByDataCy('group-control-header').should(
					'include.text',
					'rel'
				);
				cy.getByDataCy('group-control-header').should(
					'include.text',
					'sponsored'
				);

				//	Check data provide value
				cy.getByDataCy('group-control-header').then(() => {
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

			it('should context and local value be updated, when select target and add data', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <AttributesControl {...defaultProps} />,
					value: [{ key: '', __key: '', value: '', isVisible: true }],
					store: STORE_NAME,
					name,
				});

				cy.getByDataCy('group-control-header').click();
				cy.contains('Popover').as('popover');
				cy.get('@popover').get('select').select('target');

				cy.get('@popover').get('select').last().select('_self');

				cy.getByDataCy('group-control-header').should(
					'include.text',
					'target'
				);
				cy.getByDataCy('group-control-header').should(
					'include.text',
					'_self'
				);

				//Check data provide value
				cy.getByDataCy('group-control-header').then(() => {
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

			it('should context and local value be updated, when select hreflang and add data', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <AttributesControl {...defaultProps} />,
					value: [{ key: '', __key: '', value: '', isVisible: true }],
					store: STORE_NAME,
					name,
				});
				cy.getByDataCy('group-control-header').click();
				cy.contains('Popover').as('popover');
				cy.get('@popover').get('select').select('hreflang');
				cy.get('@popover').get('input').type('hreflang value');

				cy.getByDataCy('group-control-header').should(
					'include.text',
					'hreflang'
				);
				cy.getByDataCy('group-control-header').should(
					'include.text',
					'hreflang value'
				);

				//Check data provider value
				cy.getByDataCy('group-control-header').then(() => {
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

			it('should context and local value be updated, when select referrerpolicy and add data', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <AttributesControl {...defaultProps} />,
					value: [{ key: '', __key: '', value: '', isVisible: true }],
					store: STORE_NAME,
					name,
				});

				cy.getByDataCy('group-control-header').click();
				cy.contains('Popover').as('popover');
				cy.get('@popover').get('select').select('referrerpolicy');

				cy.get('@popover').get('select').last().select('origin');

				cy.getByDataCy('group-control-header').should(
					'include.text',
					'referrerpolicy'
				);
				cy.getByDataCy('group-control-header').should(
					'include.text',
					'origin'
				);

				//Check data provide value
				cy.getByDataCy('group-control-header').then(() => {
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

	describe('attributeElement is button', () => {
		const defaultProps = {
			label: 'Button',
			popoverLabel: 'Popover',
			attributeElement: 'button',
		};

		it('should render correctly with value ,(default attribute:none)', () => {
			cy.withDataProvider({
				component: <AttributesControl {...defaultProps} />,
				value: [{ key: '', __key: '', value: '', isVisible: true }],
				store: STORE_NAME,
			});

			cy.getByDataCy('group-control-header').should('exist');
			// check attribute value
			cy.getByDataCy('group-control-header').click();
			cy.contains('Popover')
				.parent()
				.within(() => {
					cy.get('input').should('not.exist');
				});
		});

		describe('interaction test', () => {
			it('should context and local value be updated, when select custom and add data', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <AttributesControl {...defaultProps} />,
					value: [{ key: '', __key: '', value: '', isVisible: true }],
					store: STORE_NAME,
					name,
				});

				cy.getByDataCy('group-control-header').click();
				cy.contains('Popover').as('popover');
				cy.get('@popover').get('select').select('custom');

				cy.get('@popover').get('input').first().type('custom key');
				cy.get('@popover').get('input').last().type('custom value');

				cy.getByDataCy('group-control-header').should(
					'include.text',
					'custom key'
				);
				cy.getByDataCy('group-control-header').should(
					'include.text',
					'custom value'
				);

				//Check data provide value
				cy.getByDataCy('group-control-header').then(() => {
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

			it('should context and local value be updated, when select type and add data', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <AttributesControl {...defaultProps} />,
					value: [{ key: '', __key: '', value: '', isVisible: true }],
					store: STORE_NAME,
					name,
				});

				cy.getByDataCy('group-control-header').click();
				cy.contains('Popover').as('popover');
				cy.get('@popover').get('select').select('type');

				cy.get('@popover').get('select').last().select('reset');

				cy.getByDataCy('group-control-header').should(
					'include.text',
					'type'
				);
				cy.getByDataCy('group-control-header').should(
					'include.text',
					'reset'
				);

				//Check data provide value
				cy.getByDataCy('group-control-header').then(() => {
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

	describe('attributeElement is ol', () => {
		const defaultProps = {
			label: 'Ol',
			popoverLabel: 'Popover',
			attributeElement: 'ol',
		};

		it('should render correctly with value ,(default attribute:none)', () => {
			cy.withDataProvider({
				component: <AttributesControl {...defaultProps} />,
				value: [{ key: '', __key: '', value: '', isVisible: true }],
				store: STORE_NAME,
			});

			cy.getByDataCy('group-control-header').should('exist');
			// check attribute value
			cy.getByDataCy('group-control-header').click();
			cy.contains('Popover')
				.parent()
				.within(() => {
					cy.get('input').should('not.exist');
				});
		});

		describe('interaction test', () => {
			it('should context and local value be updated, when select custom and add data', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <AttributesControl {...defaultProps} />,
					value: [{ key: '', __key: '', value: '', isVisible: true }],
					store: STORE_NAME,
					name,
				});

				cy.getByDataCy('group-control-header').click();
				cy.contains('Popover').as('popover');
				cy.get('@popover').get('select').select('custom');

				cy.get('@popover').get('input').first().type('custom key');
				cy.get('@popover').get('input').last().type('custom value');

				cy.getByDataCy('group-control-header').should(
					'include.text',
					'custom key'
				);
				cy.getByDataCy('group-control-header').should(
					'include.text',
					'custom value'
				);

				//Check data provider value
				cy.getByDataCy('group-control-header').then(() => {
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

			it('should context and local value be updated, when select type and add data', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <AttributesControl {...defaultProps} />,
					value: [{ key: '', __key: '', value: '', isVisible: true }],
					store: STORE_NAME,
					name,
				});

				cy.getByDataCy('group-control-header').click();
				cy.contains('Popover').as('popover');
				cy.get('@popover').get('select').select('type');

				cy.get('@popover').get('select').last().select('A');

				cy.getByDataCy('group-control-header').should(
					'include.text',
					'type'
				);
				cy.getByDataCy('group-control-header').should(
					'include.text',
					'A'
				);

				//Check data provider value
				cy.getByDataCy('group-control-header').then(() => {
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

			it('should context and local value be updated, when select start and add data', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <AttributesControl {...defaultProps} />,
					value: [{ key: '', __key: '', value: '', isVisible: true }],
					store: STORE_NAME,
					name,
				});

				cy.getByDataCy('group-control-header').click();
				cy.contains('Popover').as('popover');
				cy.get('@popover').get('select').select('start');

				cy.get('@popover').get('input').type('start value');

				cy.getByDataCy('group-control-header').should(
					'include.text',
					'start'
				);
				cy.getByDataCy('group-control-header').should(
					'include.text',
					'start value'
				);

				//Check data provider value
				cy.getByDataCy('group-control-header').then(() => {
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

			it('should context and local value be updated, when select reversed and add data', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <AttributesControl {...defaultProps} />,
					value: [{ key: '', __key: '', value: '', isVisible: true }],
					store: STORE_NAME,
					name,
				});

				cy.getByDataCy('group-control-header').click();
				cy.contains('Popover').as('popover');
				cy.get('@popover').get('select').select('reversed');

				cy.get('@popover').get('input').type('reversed value');

				cy.get('@popover');
				cy.getByDataCy('group-control-header').should(
					'include.text',
					'reversed'
				);
				cy.getByDataCy('group-control-header').should(
					'include.text',
					'reversed value'
				);

				//Check data provider value
				cy.getByDataCy('group-control-header').then(() => {
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
});
