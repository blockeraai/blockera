/**
 * Publisher dependencies
 */
import { renderHook } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { useOutsideClick } from '../';

describe('useOutsideClick', () => {
	it('should call onOutsideClick when clicking outside the component', () => {
		const onOutsideClick = jest.fn();
		const { result } = renderHook(() =>
			useOutsideClick({ onOutsideClick })
		);
		const div = document.createElement('div');
		const div2 = document.createElement('div');

		// Simulate a click outside the component
		result.current.ref.current = div;
		document.body.appendChild(div);
		document.body.appendChild(div2);
		div2.click();

		// Ensure onOutsideClick was called
		expect(onOutsideClick).toHaveBeenCalled();

		// Clean up the div
		document.body.removeChild(div);

		// Clean up the hook
		result.current.ref.current = null;
	});

	it('should not call onOutsideClick when clicking inside the component', () => {
		const onOutsideClick = jest.fn();
		const { result } = renderHook(() =>
			useOutsideClick({ onOutsideClick })
		);
		const div = document.createElement('div');

		// Simulate a click inside the component
		result.current.ref.current = div;
		div.click();

		// Ensure onOutsideClick was not called
		expect(onOutsideClick).not.toHaveBeenCalled();

		// Clean up the hook
		result.current.ref.current = null;
	});

	it('should remove event listener on unmount', () => {
		const onOutsideClick = jest.fn();
		const { unmount } = renderHook(() =>
			useOutsideClick({ onOutsideClick })
		);

		const spy = jest.spyOn(document, 'removeEventListener');

		// Ensure that the event listener was added
		expect(spy).not.toHaveBeenCalledWith('click', expect.any(Function));

		// Unmount the hook
		unmount();

		// Ensure that the event listener was removed
		expect(spy).toHaveBeenCalledWith('click', expect.any(Function));
	});
});
