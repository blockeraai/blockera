import SearchReplaceControl from '..';
import { nanoid } from 'nanoid';
import { STORE_NAME } from '../../repeater-control/store';
import { select } from '@wordpress/data';
import { modifyControlValue } from '../../../store/actions';
import { controlReducer } from '../../../store/reducers/control-reducer';
import { getControlValue } from '../../../store/selectors';

describe('search-replace-control component testing', () => {
	describe('rendering test', () => {
		it('should render correctly with label', () => {
			cy.withDataProvider({
				component: <SearchReplaceControl label="Search and Replace" />,
				value: { 0: { search: '', replace: '', isVisible: true } },
				store: STORE_NAME,
			});

			cy.contains('Search and Replace').should('exist');
		});

		it('should render correctly with empty value', () => {
			cy.withDataProvider({
				component: <SearchReplaceControl />,
				value: {},
				store: STORE_NAME,
			});

			cy.getByDataCy('group-control-header').should('not.exist');
		});

		it('should render correctly without value and defaultValue', () => {
			cy.withDataProvider({
				component: <SearchReplaceControl />,
				store: STORE_NAME,
			});

			cy.getByDataCy('group-control-header').should('not.exist');
		});

		it('should render correctly with value', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <SearchReplaceControl />,
				value: { 0: { search: '', replace: '', isVisible: true } },
				store: STORE_NAME,
				name,
			});
			cy.getByDataCy('group-control-header').should('exist');
		});

		it('should render correctly with defaultValue', () => {
			cy.withDataProvider({
				component: (
					<SearchReplaceControl
						defaultValue={{
							0: {
								search: 'Jon',
								value: 'Doe',
								isVisible: true,
							},
						}}
					/>
				),
				store: STORE_NAME,
			});

			cy.getByDataCy('group-control-header').should(
				'include.text',
				'Jon'
			);
		});

		it('should popover not be open at first rendering, when passing false to isOpen(default)', () => {
			cy.withDataProvider({
				component: (
					<SearchReplaceControl popoverTitle="Search and Replace Popover" />
				),
				store: STORE_NAME,
				value: { 0: { search: '', replace: '', isOpen: false } },
			});

			cy.contains('Search and Replace Popover').should('not.exist');
		});

		it('should popover be open at first rendering, when passing true to isOpen', () => {
			cy.withDataProvider({
				component: (
					<SearchReplaceControl popoverTitle="Search and Replace Popover" />
				),
				store: STORE_NAME,
				value: { 0: { search: '', replace: '', isOpen: true } },
			});

			cy.contains('Search and Replace Popover').should('exist');
		});

		it('should repeater item have is-active class, when passing true to isVisible(default)', () => {
			cy.withDataProvider({
				component: <SearchReplaceControl />,
				store: STORE_NAME,
				value: { 0: { search: '', replace: '', isVisible: true } },
			});

			cy.getByDataCy('group-control-header')
				.parent()
				.parent()
				.should('have.class', 'is-active');
		});

		it('should repeater item have is-inactive class, when passing false to isVisible', () => {
			cy.withDataProvider({
				component: <SearchReplaceControl />,
				store: STORE_NAME,
				value: { 0: { search: '', replace: '', isVisible: false } },
			});

			cy.getByDataCy('group-control-header')
				.parent()
				.parent()
				.should('have.class', 'is-inactive');
		});
	});

	describe('interaction test', () => {
		it('should context and local value be updated, when add data', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <SearchReplaceControl />,
				value: { 0: { search: '', replace: '', isVisible: true } },
				store: STORE_NAME,
				name,
			});

			cy.getByDataCy('group-control-header').click();
			cy.getByDataTest('popover-body').within(() => {
				cy.getByAriaLabel('Text To Search').type('Jon');
				cy.getByAriaLabel('Replacement Text').type('Doe');
			});

			//Check repeater item
			cy.getByDataCy('group-control-header').should(
				'include.text',
				'Jon'
			);
			cy.getByDataCy('group-control-header').should(
				'include.text',
				'Doe'
			);

			//Check data provide value
			cy.getByDataCy('group-control-header').then(() => {
				expect({
					0: {
						search: 'Jon',
						replace: 'Doe',
						isVisible: true,
					},
				}).to.be.deep.equal(getControlValue(name, STORE_NAME));
			});
		});

		it('should onChange be called, when interacting', () => {
			const name = nanoid();
			const propsToPass = {
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
				component: <SearchReplaceControl {...propsToPass} />,
				value: { 0: { search: '', replace: '', isVisible: true } },
				store: STORE_NAME,
				name,
			});

			cy.getByDataCy('group-control-header').click();
			cy.getByDataTest('popover-body').within(() => {
				cy.getByAriaLabel('Text To Search').type('Jon');
				cy.getByAriaLabel('Replacement Text').type('Doe');
			});

			cy.get('@onChange').should('have.been.called');
		});
	});
});
