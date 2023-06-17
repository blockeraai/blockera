/**
 * Testing-Library deps
 */
import { render, screen } from '@testing-library/react';
import { InputControl } from '../input';

/**
 * Internal dependencies
 */
// import { InputControl } from "../input";

describe('testing input control', () => {
	it('InputControl render correctly', () => {
		render(
			<InputControl
				{...{
					range: false,
					initValue: '10px',
					className: 'publisher-input',
					value: '',
					'data-testid': 'input-control',
				}}
			/>
		);
		expect(screen.getByTestId('input-control')).toBeInTheDocument();

		// expect(1).toBe(1);
	});
});
