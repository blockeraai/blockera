import NoticeControl from '..';
import { nanoid } from 'nanoid';
import { controlReducer } from '../../../store/reducers/control-reducer';
import { modifyControlValue } from '../../../store/actions';
import { select } from '@wordpress/data';

describe('notice-control component testing', () => {
	const defaultProps = {
		children: 'This is a test text.',
	};
	beforeEach(() => {
		cy.viewport(1280, 720);
	});

	describe('rendering test', () => {
		it('should render correctly, when passing label', () => {
			cy.withDataProvider({
				component: (
					<NoticeControl label="Notice Label" {...defaultProps} />
				),
			});

			cy.contains('Notice Label').should('exist');
		});

		it('should not render, when passing false to isShown', () => {
			cy.withDataProvider({
				component: <NoticeControl isShown={false} {...defaultProps} />,
			});

			cy.contains('Notice Label').should('not.exist');
		});

		context('type', () => {
			it('should render correctly, when passing information', () => {
				cy.withDataProvider({
					component: (
						<NoticeControl type="information" {...defaultProps} />
					),
				});

				//Check className
				cy.getByDataTest('notice-control').should('exist');
				cy.getByDataTest('notice-control')
					.invoke('attr', 'class')
					.should('include', 'blockera-information');

				//Check icon
				cy.getByDataTest('notice-control-icon-info').should('exist');
			});

			it('should render correctly, when passing warning', () => {
				cy.withDataProvider({
					component: (
						<NoticeControl type="warning" {...defaultProps} />
					),
				});

				//Check className
				cy.getByDataTest('notice-control').should('exist');
				cy.getByDataTest('notice-control')
					.invoke('attr', 'class')
					.should('include', 'blockera-warning');

				//Check icon
				cy.getByDataTest('notice-control-icon-warning').should('exist');
			});

			it('should render correctly, when passing success', () => {
				cy.withDataProvider({
					component: (
						<NoticeControl type="success" {...defaultProps} />
					),
				});

				//Check className
				cy.getByDataTest('notice-control').should('exist');
				cy.getByDataTest('notice-control')
					.invoke('attr', 'class')
					.should('include', 'blockera-success');

				//Check icon
				cy.getByDataTest('notice-control-icon-success').should('exist');
			});

			it('should render correctly, when passing error', () => {
				cy.withDataProvider({
					component: <NoticeControl type="error" {...defaultProps} />,
				});

				//Check className
				cy.getByDataTest('notice-control').should('exist');
				cy.getByDataTest('notice-control')
					.invoke('attr', 'class')
					.should('include', 'blockera-error');

				//Check icon
				cy.getByDataTest('notice-control-icon-error').should('exist');
			});
		});

		context('children', () => {
			it('should not render, when passing no children', () => {
				cy.withDataProvider({
					component: <NoticeControl />,
				});

				cy.getByDataTest('notice-control').should('not.exist');
			});

			it('should render correctly, when passing string', () => {
				cy.withDataProvider({
					component: (
						<NoticeControl children={'String children prop'} />
					),
				});

				cy.getByDataTest('notice-control-content').should(
					'have.text',
					'String children prop'
				);
			});

			it('should render correctly, when passing jsx', () => {
				const children = (
					<div>
						<span>Title</span>
						<p>JSX children prop</p>
					</div>
				);
				cy.withDataProvider({
					component: <NoticeControl children={children} />,
				});

				cy.getByDataTest('notice-control-content')
					.invoke('text')
					.should('include', 'JSX children prop')
					.and('include', 'Title');
			});
		});

		context('icon', () => {
			it('should render icon, when passing true to showIcon(default)', () => {
				cy.withDataProvider({
					component: (
						<NoticeControl
							{...defaultProps}
							type="warning"
							showIcon={true}
						/>
					),
				});

				cy.getByDataTest('notice-control-icon-warning').should('exist');
			});

			it('should not render icon, when passing false to showIcon', () => {
				cy.withDataProvider({
					component: (
						<NoticeControl
							{...defaultProps}
							type="warning"
							showIcon={false}
						/>
					),
				});

				cy.getByDataTest('notice-control-icon-warning').should(
					'not.exist'
				);
			});
		});

		context('dismiss', () => {
			it('should not render dismiss, when passing false to isDismissible(default)', () => {
				cy.withDataProvider({
					component: (
						<NoticeControl
							{...defaultProps}
							isDismissible={false}
						/>
					),
				});

				cy.getByDataTest('notice-control-dismiss').should('not.exist');
			});

			it('should render dismiss, when passing true to isDismissible', () => {
				cy.withDataProvider({
					component: (
						<NoticeControl {...defaultProps} isDismissible={true} />
					),
				});

				cy.getByDataTest('notice-control-dismiss').should('exist');
			});
		});
	});

	context('interaction test', () => {
		it('should remove notice, when click on dismiss', () => {
			cy.withDataProvider({
				component: (
					<NoticeControl isDismissible={true} {...defaultProps} />
				),
			});

			cy.getByDataTest('notice-control-dismiss').click();

			cy.getByDataTest('notice-control').should('not.exist');
		});

		it('should onDismiss be called, when interacting', () => {
			const name = nanoid();
			const defaultProps = {
				onDismiss: (value) => {
					controlReducer(
						select('blockera/controls').getControl(name),
						modifyControlValue({
							value,
							controlId: name,
						})
					);
				},
				children: 'This is a test text.',
			};
			cy.stub(defaultProps, 'onDismiss').as('onDismiss');

			cy.withDataProvider({
				component: (
					<NoticeControl {...defaultProps} isDismissible={true} />
				),
				name,
			});

			cy.getByDataTest('notice-control-dismiss').click();

			cy.get('@onDismiss').should('have.been.called');
		});

		it('should onShown be called, when render', () => {
			const name = nanoid();
			const defaultProps = {
				onShown: () => {},
				children: 'This is a test text.',
			};
			cy.stub(defaultProps, 'onShown').as('onShown');

			cy.withDataProvider({
				component: <NoticeControl {...defaultProps} />,
				name,
			});

			cy.get('@onShown').should('have.been.called');
		});
	});
});
