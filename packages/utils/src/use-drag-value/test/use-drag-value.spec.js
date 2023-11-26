/**
 * External dependencies
 */
import { renderHook, render, fireEvent, cleanup } from '@testing-library/react';
import { useState } from '@wordpress/element';
import '@testing-library/jest-dom/extend-expect';
/**
 * Internal dependencies
 */
import { useDragValue } from '../index';

// Create a test component that uses the hook
function TestComponent({ movement = 'vertical' }) {
	const [value, setValue] = useState(0);
	const [onEndFired, setOnEndFired] = useState('');
	const onStart = useDragValue({
		value,
		setValue,
		movement,
		onEnd: () => {
			setOnEndFired('fired');
		},
	});

	return (
		<div data-testid="draggable" onMouseDown={onStart}>
			Draggable Element
			<div data-testid="value-display">{value}</div>
			<div data-testid="on-end-fired">{onEndFired}</div>
		</div>
	);
}

describe('testing use drag value hook', () => {
	afterEach(() => {
		// Cleanup by unmounting the component after each test
		cleanup();
	});
	it('should return a function after set states', () => {
		const myMock = jest.fn();
		const { result } = renderHook(() =>
			useDragValue({ value: 10, setValue: myMock, movement: 'vertical' })
		);
		expect(typeof result.current).toBe('function');
	});

	it('useDragValue updates value on mouse drag', () => {
		const { getByTestId } = render(<TestComponent />);
		const draggableElement = getByTestId('draggable');

		// Simulate a mouse down event to start the drag
		fireEvent.mouseDown(draggableElement);

		// Simulate mouse move event
		fireEvent.mouseMove(draggableElement, { clientY: 50 });

		// Perform assertions on the updated value
		expect(draggableElement).toHaveTextContent('Draggable Element'); // Just a sanity check

		// Simulate a mouse up event to end the drag
		fireEvent.mouseUp(draggableElement);
	});

	it('useDragValue updates value on vertical mouse drag', () => {
		const { getByTestId } = render(<TestComponent />);
		const draggableElement = getByTestId('draggable');
		const valueDisplay = getByTestId('value-display');
		const onEndFired = getByTestId('on-end-fired');

		// Simulate a mouse down event to start the vertical drag
		fireEvent.mouseDown(draggableElement, { clientY: 100 });
		fireEvent.mouseMove(draggableElement, { clientY: 50 });

		// Extract the updated value from the custom attribute
		const updatedValue = valueDisplay.textContent;

		// Calculate the expected value based on the vertical drag
		const expectedValue = '50';

		expect(updatedValue).toBe(expectedValue);

		fireEvent.mouseUp(draggableElement);

		// on End callback fired
		expect(onEndFired.textContent).toBe('fired');
	});

	it('useDragValue updates value on horizontal mouse drag', () => {
		const { getByTestId } = render(<TestComponent movement="horizontal" />);
		const draggableElement = getByTestId('draggable');
		const valueDisplay = getByTestId('value-display');
		const onEndFired = getByTestId('on-end-fired');

		// Simulate a mouse down event to start the horizontal drag
		fireEvent.mouseDown(draggableElement, { clientX: 50 });
		fireEvent.mouseMove(draggableElement, { clientX: 100 });

		// Extract the updated value from the custom attribute
		const updatedValue = valueDisplay.textContent;

		// Calculate the expected value based on the horizontal drag
		const expectedValue = '50';

		expect(updatedValue).toBe(expectedValue);

		fireEvent.mouseUp(draggableElement);

		// on End callback fired
		expect(onEndFired.textContent).toBe('fired');
	});

	it('should render an element with className "virtual-cursor-box" in the document', () => {
		// Render the component or call the function that renders the element
		const { getByTestId } = render(<TestComponent movement="vertical" />);
		const draggableElement = getByTestId('draggable');

		// Simulate a mouse down event to start the horizontal drag
		fireEvent.mouseDown(draggableElement, { clientX: 50 });
		// Check if an element with the specified className exists in the document
		const elementWithClassName = document.querySelector(
			'.publisher-virtual-cursor-box'
		);
		expect(elementWithClassName).toBeInTheDocument();
		fireEvent.mouseMove(draggableElement, { clientX: 100 });
	});
});
