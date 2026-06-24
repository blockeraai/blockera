import {
	computeInspectorPopoverOffset,
	DEFAULT_POPOVER_OFFSET,
	getInspectorSidebarElement,
	getPopoverRoot,
	getPopoverRootFromCloseControl,
	hasNestedOverlayOpenAsideFrom,
	isOtherPopoverClosing,
	isPopoverDismissIgnoredTarget,
	markPopoverClosing,
	resolvePopoverAnchorElement,
	shouldIgnorePopoverFocusOutside,
} from '../utils';

describe('popover offset utils', () => {
	describe('getInspectorSidebarElement', () => {
		it('returns null when anchor is missing', () => {
			expect(getInspectorSidebarElement(null)).toBeNull();
		});

		it('finds the inspector sidebar ancestor', () => {
			const sidebar = document.createElement('div');
			sidebar.className = 'interface-interface-skeleton__sidebar';
			const anchor = document.createElement('button');
			sidebar.appendChild(anchor);
			document.body.appendChild(sidebar);

			expect(getInspectorSidebarElement(anchor)).toBe(sidebar);

			document.body.removeChild(sidebar);
		});
	});

	describe('computeInspectorPopoverOffset', () => {
		afterEach(() => {
			document.body.innerHTML = '';
		});

		it('returns the default offset when anchor is missing', () => {
			expect(computeInspectorPopoverOffset(null, 'left-start')).toBe(
				DEFAULT_POPOVER_OFFSET
			);
		});

		it('computes left placement offset from anchor position within sidebar', () => {
			const sidebar = document.createElement('div');
			sidebar.className = 'interface-interface-skeleton__sidebar';
			Object.defineProperty(sidebar, 'getBoundingClientRect', {
				value: () => ({
					left: 700,
					right: 1000,
					top: 0,
					bottom: 800,
					width: 300,
					height: 800,
				}),
			});

			const anchor = document.createElement('button');
			Object.defineProperty(anchor, 'getBoundingClientRect', {
				value: () => ({
					left: 825,
					right: 860,
					top: 120,
					bottom: 150,
					width: 35,
					height: 30,
				}),
			});

			sidebar.appendChild(anchor);
			document.body.appendChild(sidebar);

			expect(computeInspectorPopoverOffset(anchor, 'left-start')).toBe(
				150
			);
		});

		it('allows consumers to override the inspector gap', () => {
			const sidebar = document.createElement('div');
			sidebar.className = 'interface-interface-skeleton__sidebar';
			Object.defineProperty(sidebar, 'getBoundingClientRect', {
				value: () => ({
					left: 700,
					right: 1000,
					top: 0,
					bottom: 800,
					width: 300,
					height: 800,
				}),
			});

			const anchor = document.createElement('button');
			Object.defineProperty(anchor, 'getBoundingClientRect', {
				value: () => ({
					left: 825,
					right: 860,
					top: 120,
					bottom: 150,
					width: 35,
					height: 30,
				}),
			});

			sidebar.appendChild(anchor);
			document.body.appendChild(sidebar);

			expect(
				computeInspectorPopoverOffset(anchor, 'left-start', 20)
			).toBe(145);
		});

		it('returns the default offset outside inspector sidebars', () => {
			const anchor = document.createElement('button');
			Object.defineProperty(anchor, 'getBoundingClientRect', {
				value: () => ({
					left: 200,
					right: 240,
					top: 120,
					bottom: 150,
					width: 40,
					height: 30,
				}),
			});
			document.body.appendChild(anchor);

			expect(computeInspectorPopoverOffset(anchor, 'left-start')).toBe(
				DEFAULT_POPOVER_OFFSET
			);
		});
	});

	describe('resolvePopoverAnchorElement', () => {
		afterEach(() => {
			document.body.innerHTML = '';
		});

		it('returns the explicit anchor when provided', () => {
			const explicitAnchor = document.createElement('button');
			const fallbackAnchor = document.createElement('span');

			expect(
				resolvePopoverAnchorElement(explicitAnchor, fallbackAnchor)
			).toBe(explicitAnchor);
		});

		it('resolves the value-addon opener within the repeater field scope', () => {
			const fieldControl = document.createElement('div');
			fieldControl.className = 'blockera-field-control';

			const fallbackAnchor = document.createElement('span');
			const opener = document.createElement('div');
			opener.className =
				'blockera-control-value-addon-pointer open-value-addon';

			Object.defineProperty(opener, 'getBoundingClientRect', {
				value: () => ({
					left: 900,
					right: 920,
					top: 200,
					bottom: 220,
					width: 20,
					height: 20,
				}),
			});

			fieldControl.appendChild(fallbackAnchor);
			fieldControl.appendChild(opener);
			document.body.appendChild(fieldControl);

			expect(resolvePopoverAnchorElement(null, fallbackAnchor)).toBe(
				opener
			);
		});

		it('falls back to the mount resolver span when no opener is found', () => {
			const fallbackAnchor = document.createElement('span');
			document.body.appendChild(fallbackAnchor);

			expect(resolvePopoverAnchorElement(null, fallbackAnchor)).toBe(
				fallbackAnchor
			);
		});

		it('prefers the open label control within the field scope', () => {
			const fieldControl = document.createElement('div');
			fieldControl.className = 'blockera-field-control';

			const fallbackAnchor = document.createElement('span');
			const labelControl = document.createElement('span');
			labelControl.dataset.cy = 'label-control';
			labelControl.className = 'is-open';

			fieldControl.appendChild(labelControl);
			fieldControl.appendChild(fallbackAnchor);
			document.body.appendChild(fieldControl);

			expect(resolvePopoverAnchorElement(null, fallbackAnchor)).toBe(
				labelControl
			);
		});

		it('does not resolve a global value-addon opener when scope has no opener', () => {
			const fieldControl = document.createElement('div');
			fieldControl.className = 'blockera-control';

			const fallbackAnchor = document.createElement('span');
			const globalOpener = document.createElement('div');
			globalOpener.className =
				'blockera-control-value-addon-pointer open-value-addon';

			fieldControl.appendChild(fallbackAnchor);
			document.body.appendChild(fieldControl);
			document.body.appendChild(globalOpener);

			expect(resolvePopoverAnchorElement(null, fallbackAnchor)).toBe(
				fallbackAnchor
			);
		});
	});

	describe('popover dismiss utils', () => {
		afterEach(() => {
			document.body.innerHTML = '';
		});

		it('getPopoverRoot returns the closest popover ancestor', () => {
			const popover = document.createElement('div');
			popover.className = 'blockera-component-popover';
			const child = document.createElement('span');
			popover.appendChild(child);
			document.body.appendChild(popover);

			expect(getPopoverRoot(child)).toBe(popover);
		});

		it('getPopoverRoot supports legacy components-popover class', () => {
			const popover = document.createElement('div');
			popover.className = 'components-popover';
			const child = document.createElement('span');
			popover.appendChild(child);
			document.body.appendChild(popover);

			expect(getPopoverRoot(child)).toBe(popover);
		});

		it('isPopoverDismissIgnoredTarget keeps parent open when nested close button is clicked', () => {
			const parentPopover = document.createElement('div');
			parentPopover.className = 'blockera-component-popover';
			document.body.appendChild(parentPopover);

			const nestedPopover = document.createElement('div');
			nestedPopover.className = 'blockera-component-popover';
			const closeButton = document.createElement('button');
			closeButton.dataset.test = 'close-popover';
			nestedPopover.appendChild(closeButton);
			document.body.appendChild(nestedPopover);

			expect(
				isPopoverDismissIgnoredTarget(parentPopover, closeButton)
			).toBe(true);
		});

		it('isPopoverDismissIgnoredTarget keeps the popover open for inside targets', () => {
			const popover = document.createElement('div');
			popover.className = 'blockera-component-popover';
			const inside = document.createElement('button');
			popover.appendChild(inside);
			document.body.appendChild(popover);

			expect(isPopoverDismissIgnoredTarget(popover, inside)).toBe(true);
			expect(isPopoverDismissIgnoredTarget(popover, document.body)).toBe(
				false
			);
		});

		it('isPopoverDismissIgnoredTarget keeps the popover open for nested popovers', () => {
			const rootPopover = document.createElement('div');
			rootPopover.className = 'blockera-component-popover';
			document.body.appendChild(rootPopover);

			const nestedPopover = document.createElement('div');
			nestedPopover.className = 'blockera-component-popover';
			const nestedButton = document.createElement('button');
			nestedPopover.appendChild(nestedButton);
			document.body.appendChild(nestedPopover);

			expect(
				isPopoverDismissIgnoredTarget(rootPopover, nestedButton)
			).toBe(true);
		});

		it('isPopoverDismissIgnoredTarget keeps the popover open for modal overlays', () => {
			const popover = document.createElement('div');
			popover.className = 'blockera-component-popover';
			document.body.appendChild(popover);

			const overlay = document.createElement('div');
			overlay.className = 'components-modal__screen-overlay';
			const modalButton = document.createElement('button');
			overlay.appendChild(modalButton);
			document.body.appendChild(overlay);

			expect(isPopoverDismissIgnoredTarget(popover, modalButton)).toBe(
				true
			);
		});

		it('shouldIgnorePopoverFocusOutside falls back to activeElement', () => {
			const popover = document.createElement('div');
			popover.className = 'blockera-component-popover';
			document.body.appendChild(popover);

			const nestedPopover = document.createElement('div');
			nestedPopover.className = 'blockera-component-popover';
			const nestedButton = document.createElement('button');
			nestedPopover.appendChild(nestedButton);
			document.body.appendChild(nestedPopover);
			nestedButton.focus();

			const event = new FocusEvent('focusout', {
				relatedTarget: null,
			});

			expect(shouldIgnorePopoverFocusOutside(event, popover)).toBe(true);
		});

		it('hasNestedOverlayOpenAsideFrom detects other popovers and modals', () => {
			const rootPopover = document.createElement('div');
			rootPopover.className = 'blockera-component-popover';
			document.body.appendChild(rootPopover);

			const nestedPopover = document.createElement('div');
			nestedPopover.className = 'blockera-component-popover';
			document.body.appendChild(nestedPopover);

			expect(hasNestedOverlayOpenAsideFrom(rootPopover)).toBe(true);

			document.body.removeChild(nestedPopover);

			const overlay = document.createElement('div');
			overlay.className = 'components-modal__screen-overlay';
			document.body.appendChild(overlay);

			expect(hasNestedOverlayOpenAsideFrom(rootPopover)).toBe(true);
		});

		it('isOtherPopoverClosing ignores parent dismiss while a nested popover closes', () => {
			const parentPopover = document.createElement('div');
			parentPopover.className = 'blockera-component-popover';
			document.body.appendChild(parentPopover);

			const nestedPopover = document.createElement('div');
			nestedPopover.className = 'blockera-component-popover';
			document.body.appendChild(nestedPopover);

			markPopoverClosing(nestedPopover);

			expect(isOtherPopoverClosing(parentPopover)).toBe(true);
			expect(isOtherPopoverClosing(nestedPopover)).toBe(false);
		});

		it('shouldIgnorePopoverFocusOutside ignores close-button clicks on nested popovers', () => {
			const parentPopover = document.createElement('div');
			parentPopover.className = 'blockera-component-popover';
			document.body.appendChild(parentPopover);

			const nestedPopover = document.createElement('div');
			nestedPopover.className = 'blockera-component-popover';
			const closeButton = document.createElement('button');
			closeButton.dataset.test = 'close-popover';
			nestedPopover.appendChild(closeButton);
			document.body.appendChild(nestedPopover);

			const event = new FocusEvent('focusout', {
				relatedTarget: null,
			});
			Object.defineProperty(event, 'target', {
				value: closeButton,
			});

			expect(shouldIgnorePopoverFocusOutside(event, parentPopover)).toBe(
				true
			);
			expect(getPopoverRootFromCloseControl(closeButton)).toBe(
				nestedPopover
			);
		});
	});
});
