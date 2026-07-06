import { getPresetRepeaterHeaderOnClick } from '../preset-repeater-header-click';

function createClickEvent(target) {
	return {
		target,
	};
}

describe('getPresetRepeaterHeaderOnClick', () => {
	it('does not open edit popover for clicks inside the variable variations strip', () => {
		const setOpen = jest.fn();
		const strip = document.createElement('div');
		strip.className = 'blockera-component-preset-variable-variations-strip';
		const label = document.createElement('span');
		label.className = 'blockera-control-header-label';
		label.textContent = '500';
		strip.appendChild(label);

		const handler = getPresetRepeaterHeaderOnClick({
			item: { selectable: false },
			isOpen: false,
			setOpen,
			isOpenPopoverEvent: () => true,
		});

		handler(createClickEvent(label));

		expect(setOpen).not.toHaveBeenCalled();
	});

	it('opens edit popover for non-selectable row clicks outside the strip', () => {
		const setOpen = jest.fn();
		const label = document.createElement('span');
		label.className = 'blockera-control-header-label';

		const handler = getPresetRepeaterHeaderOnClick({
			item: { selectable: false },
			isOpen: false,
			setOpen,
			isOpenPopoverEvent: () => true,
		});

		handler(createClickEvent(label));

		expect(setOpen).toHaveBeenCalledWith(true);
	});

	it('does not open edit popover for selectable rows', () => {
		const setOpen = jest.fn();
		const label = document.createElement('span');

		const handler = getPresetRepeaterHeaderOnClick({
			item: { selectable: true },
			isOpen: false,
			setOpen,
			isOpenPopoverEvent: () => true,
		});

		handler(createClickEvent(label));

		expect(setOpen).not.toHaveBeenCalled();
	});
});
