import TransitionControl from '..';
import { STORE_NAME } from '../../repeater-control/store';
import { nanoid } from 'nanoid';
import { getControlValue } from '../../../store/selectors';
import { controlReducer } from '../../../store/reducers/control-reducer';
import { modifyControlValue } from '../../../store/actions';
import { select } from '@wordpress/data';

describe('transition control component testing', () => {
	const value = {
		'all-0': {
			type: 'all',
			duration: '0ms',
			timing: 'ease',
			delay: '0ms',
			isVisible: true,
		},
	};
	it('should render correctly', () => {
		cy.withDataProvider({
			component: <TransitionControl />,
			value,
			store: STORE_NAME,
		});

		cy.getByDataCy('group-control-header').should('exist');
	});

	it('should render correctly with label', () => {
		cy.withDataProvider({
			component: <TransitionControl label="Transition" />,
			value,
			store: STORE_NAME,
		});

		cy.contains('Transition');
	});

	it('should render correctly with empty value', () => {
		cy.withDataProvider({
			component: <TransitionControl label="Transition" />,
			value: {},
			store: STORE_NAME,
		});

		cy.getByDataCy('group-control-header').should('not.exist');
	});

	it('should render correctly without value and defaultValue', () => {
		cy.withDataProvider({
			component: <TransitionControl label="Transition" />,
			store: STORE_NAME,
		});

		cy.getByDataCy('group-control-header').should('not.exist');
	});

	it('should render correctly with defaultValue', () => {
		cy.withDataProvider({
			component: (
				<TransitionControl
					label="Transition"
					defaultValue={{
						'all-0': {
							type: 'all',
							duration: '10ms',
							timing: 'ease',
							delay: '10ms',
							isVisible: true,
						},
					}}
				/>
			),
			store: STORE_NAME,
		});

		cy.getByDataCy('group-control-header').should('exist');
	});

	describe('interaction test ', () => {
		it('should onChange be called, when interacting', () => {
			const name = nanoid();
			const defaultValue = {
				onChange: (value) => {
					controlReducer(
						select('blockera/controls').getControl(name),
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
				value: {},
				store: STORE_NAME,
				name,
			});

			cy.get('button[aria-label="Add New Transition"]').click();

			cy.get('@onChange').should('have.been.called');
		});

		it('should context value have length of 1, when adding one more item because more items available on PRO version', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <TransitionControl label="Transition" />,
				value,
				store: STORE_NAME,
				name,
			});

			cy.get('button[aria-label="Add New Transition"]').click();

			cy.getByDataTest('popover-body').contains('Upgrade to PRO');

			//Check data provider value
			cy.get('body').then(() => {
				expect(1).to.be.equal(
					Object.keys(getControlValue(name, STORE_NAME)).length
				);
			});
		});

		it('should context and local value be updated, when change duration', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <TransitionControl label="Transition" />,
				value,
				store: STORE_NAME,
				name,
			});

			cy.getByDataCy('group-control-header').click();

			cy.getByDataTest('transition-control-popover').as('popover');
			cy.get('@popover')
				.getByDataTest('transition-input-duration')
				.as('duration-input');

			cy.get('@duration-input').clear();
			cy.get('@duration-input').type(4000);

			cy.get('@duration-input').should('have.value', '4000');

			// Check data provider value
			cy.get('@popover').then(() => {
				expect('4000ms').to.be.equal(
					getControlValue(name, STORE_NAME)['all-0'].duration
				);
			});
		});

		it('should context and local value be updated, when change timing', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <TransitionControl label="Transition" />,
				value,
				store: STORE_NAME,
				name,
			});

			cy.getByDataCy('group-control-header').click();

			cy.getByDataTest('transition-control-popover').as('popover');
			cy.get('@popover').get('select').eq(2).select('ease-in-out');

			cy.get('@popover')
				.get('select')
				.eq(2)
				.should('have.value', 'ease-in-out');

			// Check data provider value
			cy.get('@popover').then(() => {
				expect('ease-in-out').to.be.equal(
					getControlValue(name, STORE_NAME)['all-0'].timing
				);
			});
		});

		it('should context and local value be updated, when change delay', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <TransitionControl label="Transition" />,
				value,
				store: STORE_NAME,
				name,
			});

			cy.getByDataCy('group-control-header').click();

			cy.getByDataTest('transition-control-popover').as('popover');
			cy.get('@popover')
				.getByDataTest('transition-input-delay')
				.as('delay-input');

			cy.get('@delay-input').clear();
			cy.get('@delay-input').type(3000);

			cy.get('@delay-input').should('have.value', '3000');

			// Check data provider value
			cy.get('@popover').then(() => {
				expect('3000ms').to.be.equal(
					getControlValue(name, STORE_NAME)['all-0'].delay
				);
			});
		});
	});

	describe('pass isOpen', () => {
		it('should popover not be open at first rendering, when passing false (default)', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: (
					<TransitionControl popoverTitle="Transition Control" />
				),
				value: {
					'all-0': {
						type: 'all',
						duration: '0ms',
						timing: 'ease',
						delay: '0ms',
						isOpen: false,
					},
				},
				store: STORE_NAME,
				name,
			});

			cy.contains('Transition Control').should('not.exist');
		});

		it('should popover be open at first rendering, when passing true', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: (
					<TransitionControl popoverTitle="Transition Control" />
				),
				value: {
					'all-0': {
						type: 'all',
						duration: '0ms',
						timing: 'ease',
						delay: '0ms',
						isOpen: true,
					},
				},
				store: STORE_NAME,
				name,
			});

			cy.contains('Transition Control').should('exist');
		});
	});

	describe('pass isVisible', () => {
		it('should repeater item be visible, when passing true (default)', () => {
			cy.withDataProvider({
				component: <TransitionControl />,
				store: STORE_NAME,
				value: {
					'all-0': {
						type: 'all',
						duration: '0ms',
						timing: 'ease',
						delay: '0ms',
						isVisible: true,
					},
				},
			});

			cy.getByDataCy('group-control-header')
				.parent()
				.parent()
				.should('have.class', 'is-active');
		});

		it('should repeater item be invisible, when passing false', () => {
			cy.withDataProvider({
				component: <TransitionControl />,
				store: STORE_NAME,
				value: {
					'all-0': {
						type: 'all',
						duration: '0ms',
						timing: 'ease',
						delay: '0ms',
						isVisible: false,
					},
				},
			});

			cy.getByDataCy('group-control-header')
				.parent()
				.parent()
				.should('have.class', 'is-inactive');
		});
	});
});
