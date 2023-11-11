import Popover from '..';
import { mount } from 'cypress/react';
import { useState } from '@wordpress/element';

const Wrapper = ({ popoverProps, ...props }) => {
	const [anchor, setAnchor] = useState();
	const [isShow, setIsShow] = useState(false);
	const style = {
		height: '100vh',
		display: 'flex',
		flexDirection: 'column',
		alignItems: props.alignItems || 'center',
		justifyContent: props.justifyContent || 'center',
		backgroundColor: '#ccc',
	};

	return (
		<div style={style} data-test="wrapper-component">
			<button
				style={{ padding: '10px 40px' }}
				ref={setAnchor}
				onClick={() => setIsShow(true)}
			>
				click
			</button>
			{isShow && <Popover anchor={anchor} {...popoverProps} />}
		</div>
	);
};

describe('popover component testing', () => {
	const defaultProps = {
		title: 'Popover Title',
		children: 'Popover Body',
		placement: 'bottom',
		flip: false,
		onClose: () => {},
	};

	describe('test title :', () => {
		it('should render correctly, without passing title', () => {
			mount(<Wrapper popoverProps={{ ...defaultProps, title: '' }} />);

			cy.contains('click').click();
			cy.contains('Popover Body');
		});
		it('should render correctly, when passing string title', () => {
			mount(<Wrapper popoverProps={defaultProps} />);

			cy.contains('click').click();
			cy.contains('Popover Title');
		});
		it('should render correctly, when passing a jsx title', () => {
			const ComponentAsTitle = () => {
				return (
					<div>
						<p>Component Title</p>
					</div>
				);
			};
			mount(
				<Wrapper
					popoverProps={{
						...defaultProps,
						title: <ComponentAsTitle />,
					}}
				/>
			);

			cy.contains('click').click();
			cy.contains('Component Title');
		});
	});

	describe('test children :', () => {
		it('should render correctly, without passing children', () => {
			mount(
				<Wrapper popoverProps={{ ...defaultProps, children: null }} />
			);

			cy.contains('click').click();
			cy.get('[data-test="wrapper-component"]')
				.children()
				.last()
				.get('[data-test="popover-body"]')
				.should('not.have.text');
		});

		it('should render correctly, when passing string children', () => {
			mount(<Wrapper popoverProps={{ ...defaultProps }} />);

			cy.contains('click').click();
			cy.contains('Popover Body');
		});

		it('should render correctly, when passing jsx children', () => {
			const ComponentAsBody = () => {
				return (
					<div>
						<p>Component Body</p>
						<p>some dummy text</p>
					</div>
				);
			};
			mount(
				<Wrapper
					popoverProps={{
						...defaultProps,
						children: <ComponentAsBody />,
					}}
				/>
			);

			cy.contains('click').click();
			cy.contains('Component Body');
			cy.contains('some dummy text');
		});
	});

	describe('should close popover ', () => {
		it('when click on close button', () => {
			mount(<Wrapper popoverProps={defaultProps} />);

			cy.contains('click').click();
			cy.get('[data-test="popover-header"')
				.children('[aria-label="Close Modal"]')
				.click();
			cy.get('[data-test="wrapper-component"]').should(
				'not.contain',
				'Popover Title'
			);
		});

		it('when focus outside', () => {
			mount(<Wrapper popoverProps={defaultProps} />);

			cy.contains('click').click();

			cy.get('body').click();

			cy.get('[data-test="wrapper-component"]').should(
				'not.contain',
				'Popover Title'
			);
		});
	});

	describe('test different placements and flip :', () => {
		const testTransformOrigin = (data) => {
			return cy
				.get('[data-test="wrapper-component"]')
				.children()
				.last()
				.should('have.attr', 'style')
				.should('contain', `transform-origin: ${data}`);
		};

		describe('when passing top-start :', () => {
			it('should render on top-start, if flip = false & has space in normal placement', () => {
				mount(
					<Wrapper
						popoverProps={{
							...defaultProps,
							placement: 'top-start',
						}}
					/>
				);

				cy.contains('click').click();
				testTransformOrigin('0% 100% 0px');
			});
			it('should render on bottom-start, if flip = true & no space in normal placement', () => {
				mount(
					<Wrapper
						popoverProps={{
							...defaultProps,
							placement: 'top-start',
							flip: true,
						}}
						justifyContent="flex-start"
					/>
				);

				cy.contains('click').click();
				testTransformOrigin('0% 0% 0px');
			});
		});

		describe('when passing top :', () => {
			it('should render on top, if flip = false & has space in normal placement', () => {
				mount(
					<Wrapper
						popoverProps={{
							...defaultProps,
							placement: 'top',
						}}
					/>
				);

				cy.contains('click').click();
				testTransformOrigin('50% 100% 0px');
			});
			it('should render on bottom, if flip = true & no space in normal placement', () => {
				mount(
					<Wrapper
						popoverProps={{
							...defaultProps,
							placement: 'top',
							flip: true,
						}}
						justifyContent="flex-start"
					/>
				);

				cy.contains('click').click();
				testTransformOrigin('50% 0% 0px');
			});
		});

		describe('when passing top-end :', () => {
			it('should render on  top-end, if flip = false & has space in normal placement', () => {
				mount(
					<Wrapper
						popoverProps={{
							...defaultProps,
							placement: 'top-end',
						}}
					/>
				);

				cy.contains('click').click();
				testTransformOrigin('100% 100% 0px');
			});
			it('should render on bottom-end, if flip = true & no space in normal placement', () => {
				mount(
					<Wrapper
						popoverProps={{
							...defaultProps,
							placement: 'top-end',
							flip: true,
						}}
						justifyContent="flex-start"
					/>
				);

				cy.contains('click').click();
				testTransformOrigin('100% 0% 0px');
			});
		});

		describe('when passing right-start :', () => {
			it('should render on  right-start, if flip = false & has space in normal placement', () => {
				mount(
					<Wrapper
						popoverProps={{
							...defaultProps,
							placement: 'right-start',
						}}
					/>
				);
				cy.contains('click').click();
				testTransformOrigin('0% 0% 0px');
			});
			it('should render on left-start, if flip = true & no space in normal placement', () => {
				mount(
					<Wrapper
						popoverProps={{
							...defaultProps,
							placement: 'right-start',
							flip: true,
						}}
						alignItems="flex-end"
					/>
				);

				cy.contains('click').click();
				testTransformOrigin('100% 0% 0px');
			});
		});

		describe('when passing right :', () => {
			it('should render on  right, if flip = false & has space in normal placement', () => {
				mount(
					<Wrapper
						popoverProps={{
							...defaultProps,
							placement: 'right',
						}}
					/>
				);

				cy.contains('click').click();
				testTransformOrigin('0% 50% 0px');
			});
			it('should render on left, if flip = true & no space in normal placement', () => {
				mount(
					<Wrapper
						popoverProps={{
							...defaultProps,
							placement: 'right',
							flip: true,
						}}
						alignItems="flex-end"
					/>
				);

				cy.contains('click').click();
				testTransformOrigin('100% 50% 0px');
			});
		});

		describe('when passing right-end :', () => {
			it('should render on  right-end, if flip = false & has space in normal placement', () => {
				mount(
					<Wrapper
						popoverProps={{
							...defaultProps,
							placement: 'right-end',
						}}
					/>
				);

				cy.contains('click').click();
				testTransformOrigin('0% 100% 0px');
			});
			it('should render on left-end, if flip = true & no space in normal placement', () => {
				mount(
					<Wrapper
						popoverProps={{
							...defaultProps,
							placement: 'right-end',
							flip: true,
						}}
						alignItems="flex-end"
					/>
				);
				cy.contains('click').click();
				testTransformOrigin('100% 100% 0');
			});
		});

		describe('when passing bottom-start :', () => {
			it('should render on bottom-start, if flip = false & has space in normal placement', () => {
				mount(
					<Wrapper
						popoverProps={{
							...defaultProps,
							placement: 'bottom-start',
						}}
					/>
				);

				cy.contains('click').click();
				testTransformOrigin('0% 0% 0px');
			});
			it('should render on top-start, if flip = true & no space in normal placement', () => {
				mount(
					<Wrapper
						popoverProps={{
							...defaultProps,
							placement: 'bottom-start',
							flip: true,
						}}
						justifyContent="flex-end"
					/>
				);
				cy.contains('click').click();
				testTransformOrigin('0% 100% 0');
			});
		});

		describe('when passing bottom :', () => {
			it('should render on bottom, if flip = false & has space in normal placement', () => {
				mount(
					<Wrapper
						popoverProps={{
							...defaultProps,
							placement: 'bottom',
						}}
					/>
				);

				cy.contains('click').click();
				testTransformOrigin('50% 0% 0px');
			});
			it('should render on top, if flip = true & no space in normal placement', () => {
				mount(
					<Wrapper
						popoverProps={{
							...defaultProps,
							placement: 'bottom',
							flip: true,
						}}
						justifyContent="flex-end"
					/>
				);

				cy.contains('click').click();
				testTransformOrigin('50% 100% 0px');
			});
		});

		describe('when passing bottom-end :', () => {
			it('should render on bottom-end, if flip = false & has space in normal placement', () => {
				mount(
					<Wrapper
						popoverProps={{
							...defaultProps,
							placement: 'bottom-end',
						}}
					/>
				);

				cy.contains('click').click();
				testTransformOrigin('100% 0% 0px');
			});
			it('should render on top-end, if flip = true & no space in normal placement', () => {
				mount(
					<Wrapper
						popoverProps={{
							...defaultProps,
							placement: 'bottom-end',
							flip: true,
						}}
						justifyContent="flex-end"
					/>
				);

				cy.contains('click').click();
				testTransformOrigin('100% 100% 0');
			});
		});

		describe('when passing left-start :', () => {
			it('should render on left-start, if flip = false & has space in normal placement', () => {
				mount(
					<Wrapper
						popoverProps={{
							...defaultProps,
							placement: 'left-start',
						}}
					/>
				);

				cy.contains('click').click();
				testTransformOrigin('100% 0% 0px');
			});
			it('should render on right-start, if flip = true & no space in normal placement', () => {
				mount(
					<Wrapper
						popoverProps={{
							...defaultProps,
							placement: 'left-start',
							flip: true,
						}}
						alignItems="flex-start"
					/>
				);
				cy.contains('click').click();
				testTransformOrigin('0% 0% 0');
			});
		});

		describe('when passing left :', () => {
			it('should render on left, if flip = false & has space in normal placement', () => {
				mount(
					<Wrapper
						popoverProps={{
							...defaultProps,
							placement: 'left',
						}}
					/>
				);

				cy.contains('click').click();
				testTransformOrigin('100% 50% 0px');
			});
			it('should render on right, if flip = true & no space in normal placement', () => {
				mount(
					<Wrapper
						popoverProps={{
							...defaultProps,
							placement: 'left',
							flip: true,
						}}
						alignItems="flex-start"
					/>
				);

				cy.contains('click').click();
				testTransformOrigin('0% 50% 0px');
			});
		});
		describe('when passing left-end :', () => {
			it('should render on left-end, if flip = false & has space in normal placement', () => {
				mount(
					<Wrapper
						popoverProps={{
							...defaultProps,
							placement: 'left-end',
						}}
					/>
				);

				cy.contains('click').click();
				testTransformOrigin('100% 100% 0');
			});
			it('should render on right-end, if flip = true & no space in normal placement', () => {
				mount(
					<Wrapper
						popoverProps={{
							...defaultProps,
							placement: 'left-end',
							flip: true,
						}}
						alignItems="flex-start"
					/>
				);

				cy.contains('click').click();
				testTransformOrigin('0% 100% 0');
			});
		});
	});

	it('should onChange be called, when click on close button', () => {
		cy.spy(defaultProps, 'onClose').as('onClose');

		mount(<Wrapper popoverProps={defaultProps} />);

		cy.contains('click').click();
		cy.get('[data-test="popover-header"')
			.children('[aria-label="Close Modal"]')
			.click();
		cy.get('@onClose').should('have.been.called');
	});
});

// transform-origin :
// top-start :0% 100% 0px
// top: 50% 100% 0px
// top-end:100% 100% 0px
// right-start : 0% 0% px
// right : 0% 50% 0px
// right-end : 0% 100% 0px
// bottom-start : 0% 0% 0px
// bottom : 50% 0% 0px
// bottom-end : 100% 0% 0px
// left-start : 100% 0% 0px
// left : 100% 50% 0px
// left-end : 100% 100% 0
