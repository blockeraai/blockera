import Popover from '..';
import { mount } from 'cypress/react';

const Wrapper = ({ children }) => {
	return (
		<div
			style={{
				height: '500px',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
			}}
			data-test="wrapper-component"
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					padding: '30px',
				}}
			>
				<button style={{ padding: '10px 20px' }}>click </button>
				{children}
			</div>
		</div>
	);
};

const wrapUp = (props) => {
	return mount(
		<Wrapper>
			<Popover {...props} />
		</Wrapper>
	);
};

describe('popover component testing', () => {
	const defaultProps = {
		title: 'Popover Title',
		children: 'Popover Body',
		placement: 'bottom-start',
		resize: true,
		shift: true,
		flip: true,
		animate: true,
		onClose: () => {},
	};

	it('render popover component without passing title', () => {
		mount(<Wrapper />);
		cy.contains('click').click();

		wrapUp({ ...defaultProps, title: '' });
		cy.contains('Popover Body');
	});

	it('render popover component with passing title', () => {
		mount(<Wrapper />);
		cy.contains('click').click();

		wrapUp({ ...defaultProps });
		cy.contains('Popover Title');
		cy.contains('Popover Body');
	});

	it('close popover via clicking on close button', () => {
		wrapUp({ ...defaultProps });
		cy.wait(2000);
		cy.get('[data-test="popover-header"')
			.children('[aria-label="Close Modal"]')
			.click();

		cy.get('[data-test="wrapper-component"]').should(
			'not.contain',
			'Popover Title'
		);
	});
});
