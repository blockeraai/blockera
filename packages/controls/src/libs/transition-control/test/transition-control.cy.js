import TransitionControl from '../index';
import { STORE_NAME } from '../../repeater-control/store';
import { nanoid } from 'nanoid';
import { getControlValue } from '../../../store/selectors';
import { controlReducer } from '../../../store/reducers/control-reducer';
import { modifyControlValue } from '../../../store/actions';
import { select } from '@wordpress/data';

describe('transition control component testing', () => {
	it('render correctly', () => {
		cy.viewport(1000, 1000);
		cy.withDataProvider({
			component: <TransitionControl />,
			value: [
				{
					type: 'all',
					duration: '0ms',
					timing: 'ease',
					delay: '0ms',
					isVisible: true,
				},
			],
			store: STORE_NAME,
		});

		cy.getByDataTest('transition-repeater-item').should('exist');
	});

	it('render correctly with label', () => {
		cy.viewport(1000, 1000);
		cy.withDataProvider({
			component: <TransitionControl label="Transition" />,
			value: [
				{
					type: 'all',
					duration: '0ms',
					timing: 'ease',
					delay: '0ms',
					isVisible: true,
				},
			],
			store: STORE_NAME,
		});

		cy.contains('Transition');
	});

	it('render correctly with empty value', () => {
		cy.viewport(1000, 1000);
		cy.withDataProvider({
			component: <TransitionControl label="Transition" />,
			value: [],
			store: STORE_NAME,
		});

		cy.getByDataTest('transition-repeater-item').should('not.exist');
	});

	describe('interaction test ', () => {
		it('add an item', () => {
			cy.viewport(1000, 1000);
			const name = nanoid();
			cy.withDataProvider({
				component: <TransitionControl label="Transition" />,
				value: [],
				store: STORE_NAME,
				name,
			});

			cy.get('button[aria-label="Add New Transition"]').click();

			cy.getByDataTest('transition-repeater-item').should('exist');
		});

		it('change type', () => {
			cy.viewport(1000, 1000);
			const name = nanoid();
			cy.withDataProvider({
				component: <TransitionControl label="Transition" />,
				value: [
					{
						type: 'all',
						duration: '0ms',
						timing: 'ease',
						delay: '0ms',
						isVisible: true,
					},
				],
				store: STORE_NAME,
				name,
			});

			cy.getByDataTest('transition-repeater-item').click();

			cy.getByDataTest('transition-control-popover').as('popover');
			cy.get('@popover').get('select').eq(0).select('Filter');

			cy.get('@popover')
				.get('select')
				.eq(0)
				.should('have.value', 'filter');

			// Check data provider value
			cy.get('@popover').then(() => {
				expect('filter').to.be.deep.equal(
					getControlValue(name, STORE_NAME)[0].type
				);
			});
		});

		it('change duration', () => {
			cy.viewport(1000, 1000);
			const name = nanoid();
			cy.withDataProvider({
				component: <TransitionControl label="Transition" />,
				value: [
					{
						type: 'all',
						duration: '0ms',
						timing: 'ease',
						delay: '0ms',
						isVisible: true,
					},
				],
				store: STORE_NAME,
				name,
			});

			cy.getByDataTest('transition-repeater-item').click();

			cy.getByDataTest('transition-control-popover').as('popover');
			cy.get('@popover')
				.getByDataTest('transition-input-duration')
				.as('duration-input');

			cy.get('@duration-input').clear();
			cy.get('@duration-input').type(4000);

			cy.get('@duration-input').should('have.value', '4000');

			// Check data provider value
			cy.get('@popover').then(() => {
				expect('4000ms').to.be.deep.equal(
					getControlValue(name, STORE_NAME)[0].duration
				);
			});
		});

		it('change timing', () => {
			cy.viewport(1000, 1000);
			const name = nanoid();
			cy.withDataProvider({
				component: <TransitionControl label="Transition" />,
				value: [
					{
						type: 'all',
						duration: '0ms',
						timing: 'ease',
						delay: '0ms',
						isVisible: true,
					},
				],
				store: STORE_NAME,
				name,
			});

			cy.getByDataTest('transition-repeater-item').click();

			cy.getByDataTest('transition-control-popover').as('popover');
			cy.get('@popover').get('select').eq(2).select('ease-in-out');

			cy.get('@popover')
				.get('select')
				.eq(2)
				.should('have.value', 'ease-in-out');

			// Check data provider value
			cy.get('@popover').then(() => {
				expect('ease-in-out').to.be.deep.equal(
					getControlValue(name, STORE_NAME)[0].timing
				);
			});
		});

		it('change delay', () => {
			cy.viewport(1000, 1000);
			const name = nanoid();
			cy.withDataProvider({
				component: <TransitionControl label="Transition" />,
				value: [
					{
						type: 'all',
						duration: '0ms',
						timing: 'ease',
						delay: '0ms',
						isVisible: true,
					},
				],
				store: STORE_NAME,
				name,
			});

			cy.getByDataTest('transition-repeater-item').click();

			cy.getByDataTest('transition-control-popover').as('popover');
			cy.get('@popover')
				.getByDataTest('transition-input-delay')
				.as('delay-input');

			cy.get('@delay-input').clear();
			cy.get('@delay-input').type(3000);

			cy.get('@delay-input').should('have.value', '3000');

			// Check data provider value
			cy.get('@popover').then(() => {
				expect('3000ms').to.be.deep.equal(
					getControlValue(name, STORE_NAME)[0].delay
				);
			});
		});

		it('change all data', () => {
			cy.viewport(1000, 1000);
			const name = nanoid();
			cy.withDataProvider({
				component: <TransitionControl label="Transition" />,
				value: [
					{
						type: 'all',
						duration: '0ms',
						timing: 'ease',
						delay: '0ms',
						isVisible: true,
					},
				],
				store: STORE_NAME,
				name,
			});

			cy.getByDataTest('transition-repeater-item').click();
			cy.getByDataTest('transition-control-popover').as('popover');

			//type
			cy.get('@popover').get('select').eq(0).select('opacity');

			//duration
			cy.get('@popover')
				.getByDataTest('transition-input-duration')
				.clear();
			cy.get('@popover')
				.getByDataTest('transition-input-duration')
				.type(100);

			//timing
			cy.get('@popover').get('select').eq(2).select('ease-out');

			//delay
			cy.get('@popover').getByDataTest('transition-input-delay').clear();
			cy.get('@popover').getByDataTest('transition-input-delay').type(3);

			//delay format
			cy.get('@popover')
				.getByDataTest('transition-input-delay')
				.next()
				.children()
				.first()
				.select('s');

			//check current data
			cy.get('@popover')
				.get('select')
				.eq(0)
				.should('have.value', 'opacity');

			cy.get('@popover')
				.getByDataTest('transition-input-duration')
				.should('have.value', '100');

			cy.get('@popover')
				.get('select')
				.eq(2)
				.should('have.value', 'ease-out');

			cy.get('@popover')
				.getByDataTest('transition-input-delay')
				.should('have.value', '3');

			//Check data provider value
			cy.get('@popover').then(() => {
				expect([
					{
						type: 'opacity',
						duration: '100ms',
						timing: 'ease-out',
						delay: '3s',
						isVisible: true,
					},
				]).to.be.deep.equal(getControlValue(name, STORE_NAME));
			});
		});
	});

	it('does onChange fire?', () => {
		const name = nanoid();
		const defaultValue = {
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

		cy.stub(defaultValue, 'onChange').as('onChange');

		cy.withDataProvider({
			component: <TransitionControl {...defaultValue} />,
			value: [],
			store: STORE_NAME,
			name,
		});

		cy.get('button[aria-label="Add New Transition"]').click();

		cy.get('@onChange').should('have.been.called');
	});
});

//	cy.getByDataTest('transition-input-duration');
//	cy.getByDataTest('transition-repeater-item');
