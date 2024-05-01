import { SearchControl } from '../../..';
import { getControlValue } from '../../../store/selectors';
import { nanoid } from 'nanoid';
import { select } from '@wordpress/data';
import { modifyControlValue } from '../../../store/actions';
import { controlReducer } from '../../../store/reducers/control-reducer';
// eslint-disable-next-line import/no-unresolved
import 'cypress-real-events';

const getSearchInput = () => cy.get('input[type="search"]');
describe('search control component testing', () => {
	it('render correctly', () => {
		cy.viewport(1000, 1000);
		cy.withDataProvider({
			component: <SearchControl />,
			value: '',
		});
		getSearchInput().should('exist');
	});
	describe('interaction test', () => {
		it('type some text', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <SearchControl />,
				value: '',
				name,
			});

			getSearchInput().type('some text ...');
			getSearchInput().should('have.value', 'some text ...');

			//Check data provider value
			getSearchInput().then(() => {
				expect('some text ...').to.be.equal(getControlValue(name));
			});
		});

		it('type and reset by button', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <SearchControl />,
				value: '',
				name,
			});

			getSearchInput().type('test');
			getSearchInput().should('have.value', 'test');
			//reset
			getSearchInput().get('button').click();
			getSearchInput().should('have.value', '');

			//Check data provider value
			cy.get('input[type="search"]').then(() => {
				expect('').to.be.equal(getControlValue(name));
			});
		});

		it('type and reset by escape', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <SearchControl />,
				value: '',
				name,
			});

			getSearchInput().type('some text ...');
			getSearchInput().should('have.value', 'some text ...');
			//reset
			getSearchInput().realType('{esc}');
			getSearchInput().should('have.value', '');

			//Check data provider value
			getSearchInput().then(() => {
				expect('').to.be.equal(getControlValue(name));
			});
		});

		it('does onChange fire?', () => {
			const name = nanoid();
			const defaultProps = {
				onChange: (value) => {
					controlReducer(
						select('blockera-core/controls').getControl(name),
						modifyControlValue({
							value,
							controlId: name,
						})
					);
				},
			};
			cy.stub(defaultProps, 'onChange').as('onChange');
			cy.withDataProvider({
				component: <SearchControl {...defaultProps} />,
				value: '',
				name,
			});

			getSearchInput().type('text');
			cy.get('@onChange').should('have.been.called');
		});
	});

	describe('rendering test ', () => {
		it('render with label', () => {
			cy.withDataProvider({
				component: <SearchControl label="Search" />,
				value: '',
			});

			cy.contains('Search');
		});

		it('pass placeholder', () => {
			cy.withDataProvider({
				component: <SearchControl placeholder={'search ...'} />,
				value: '',
			});

			getSearchInput()
				.should('have.attr', 'placeholder')
				.should('be.equal', 'search ...');
		});

		it('pass is-hovered className', () => {
			cy.withDataProvider({
				component: <SearchControl className="is-hovered" />,
				value: '',
			});

			getSearchInput()
				.parent()
				.parent()
				.parent()
				.should('have.class', 'is-hovered');
		});
		it('pass is-focused className', () => {
			cy.withDataProvider({
				component: <SearchControl className="is-focused" />,
				value: '',
			});

			getSearchInput()
				.parent()
				.parent()
				.parent()
				.should('have.class', 'is-focused');
		});

		it('pass value', () => {
			cy.withDataProvider({
				component: <SearchControl className="is-focused" />,
				value: 'text',
			});

			getSearchInput().should('have.value', 'text');
		});
	});

	describe('test useControlContext', () => {
		it('should render default value when:defaultValue OK && id !OK && value is undefined', () => {
			cy.withDataProvider({
				component: <SearchControl defaultValue={'default value'} />,
			});

			getSearchInput().should('have.value', 'default value');
		});

		it('should render value when: defaultValue OK && id OK && value is OK', () => {
			cy.withDataProvider({
				component: (
					<SearchControl defaultValue={'default value'} id={'[0]'} />
				),
				value: ['value'],
			});

			getSearchInput().should('have.value', 'value');
		});

		it('should render default value when:defaultValue OK && id is invalid, value ok', () => {
			cy.withDataProvider({
				component: (
					<SearchControl defaultValue={'default value'} id={'[1]'} />
				),
				value: ['value'],
			});

			getSearchInput().should('have.value', 'default value');
		});

		it('should render default value when:defaultValue OK && id is valid, value is invalid', () => {
			cy.withDataProvider({
				component: (
					<SearchControl
						defaultValue={'default value'}
						id={'[0].data'}
					/>
				),
				value: [{ data: undefined }],
			});

			getSearchInput().should('have.value', 'default value');
		});

		it('should render value when:defaultValue !OK && id !OK && value exists on root', () => {
			cy.withDataProvider({
				component: <SearchControl />,
				value: 'value',
			});

			getSearchInput().should('have.value', 'value');
		});
	});
});
