import {
	computeInspectorPopoverOffset,
	DEFAULT_POPOVER_OFFSET,
	getInspectorSidebarElement,
	getPopoverRoot,
	getPopoverRootFromCloseControl,
	hasNestedOverlayOpenAsideFrom,
	isOtherPopoverClosing,
	isPopoverDismissIgnoredTarget,
	isSketchPickerInteractionActiveFor,
	isElementInsideValueAddonPointers,
	isElementInsideVariablePickerPopover,
	isElementInsideVariablePickerSelectionTarget,
	linkNestedPopoverToParent,
	markPopoverClosing,
	registerPopoverOpen,
	resolvePopoverAnchorElement,
	shouldDismissPopoverFromPointerDown,
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

			linkNestedPopoverToParent(nestedPopover, parentPopover);

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

		it('isPopoverDismissIgnoredTarget keeps the popover open for nested popovers opened from parent', () => {
			const rootPopover = document.createElement('div');
			rootPopover.className = 'blockera-component-popover';
			document.body.appendChild(rootPopover);

			const nestedPopover = document.createElement('div');
			nestedPopover.className = 'blockera-component-popover';
			const nestedButton = document.createElement('button');
			nestedPopover.appendChild(nestedButton);
			document.body.appendChild(nestedPopover);

			linkNestedPopoverToParent(nestedPopover, rootPopover);

			expect(
				isPopoverDismissIgnoredTarget(rootPopover, nestedButton)
			).toBe(true);
		});

		it('isPopoverDismissIgnoredTarget dismisses when another unrelated popover is clicked', () => {
			const rootPopover = document.createElement('div');
			rootPopover.className = 'blockera-component-popover';
			document.body.appendChild(rootPopover);

			const unrelatedPopover = document.createElement('div');
			unrelatedPopover.className = 'blockera-component-popover';
			const unrelatedButton = document.createElement('button');
			unrelatedPopover.appendChild(unrelatedButton);
			document.body.appendChild(unrelatedPopover);

			expect(
				isPopoverDismissIgnoredTarget(rootPopover, unrelatedButton)
			).toBe(false);
		});

		it('isPopoverDismissIgnoredTarget keeps the popover open for value-addon pointer icon targets', () => {
			const popover = document.createElement('div');
			popover.className = 'blockera-component-popover';
			const field = document.createElement('div');
			field.className = 'blockera-field-control';
			const pointers = document.createElement('div');
			pointers.className =
				'blockera-control blockera-control-value-addon-pointers';
			const pointer = document.createElement('div');
			pointer.className = 'blockera-control-value-addon-pointer';
			const icon = document.createElementNS(
				'http://www.w3.org/2000/svg',
				'svg'
			);
			const path = document.createElementNS(
				'http://www.w3.org/2000/svg',
				'path'
			);
			icon.appendChild(path);
			pointer.appendChild(icon);
			pointers.appendChild(pointer);
			field.appendChild(pointers);
			popover.appendChild(field);
			document.body.appendChild(popover);

			expect(isPopoverDismissIgnoredTarget(popover, path)).toBe(true);
			expect(
				shouldDismissPopoverFromPointerDown(popover, path, null)
			).toBe(false);
		});

		it('isPopoverDismissIgnoredTarget keeps the popover open for value-addon pointers', () => {
			const popover = document.createElement('div');
			popover.className = 'blockera-component-popover';
			document.body.appendChild(popover);

			const pointers = document.createElement('div');
			pointers.className =
				'blockera-control blockera-control-value-addon-pointers';
			const varButton = document.createElement('button');
			varButton.className = 'blockera-control-value-addon-pointer';
			varButton.dataset.cy = 'value-addon-btn-open';
			pointers.appendChild(varButton);
			document.body.appendChild(pointers);

			expect(isElementInsideValueAddonPointers(varButton)).toBe(true);
			expect(isPopoverDismissIgnoredTarget(popover, varButton)).toBe(
				true
			);
			expect(isPopoverDismissIgnoredTarget(popover, pointers)).toBe(true);
		});

		it('shouldDismissPopoverFromPointerDown ignores value-addon pointer clicks', () => {
			const popover = document.createElement('div');
			popover.className = 'blockera-component-popover';
			document.body.appendChild(popover);

			const pointers = document.createElement('div');
			pointers.className =
				'blockera-control blockera-control-value-addon-pointers';
			const varButton = document.createElement('button');
			pointers.appendChild(varButton);
			document.body.appendChild(pointers);

			expect(
				shouldDismissPopoverFromPointerDown(popover, varButton, null)
			).toBe(false);
		});

		it('keeps parent open but dismisses var-picker when pointer is clicked', () => {
			const parentPopover = document.createElement('div');
			parentPopover.className = 'blockera-component-popover';
			const field = document.createElement('div');
			field.className = 'blockera-field-control';
			const pointers = document.createElement('div');
			pointers.className =
				'blockera-control blockera-control-value-addon-pointers';
			const pointer = document.createElement('button');
			pointer.className = 'blockera-control-value-addon-pointer';
			pointers.appendChild(pointer);
			field.appendChild(pointers);
			parentPopover.appendChild(field);
			document.body.appendChild(parentPopover);

			const varPickerPopover = document.createElement('div');
			varPickerPopover.className = 'blockera-component-popover';
			document.body.appendChild(varPickerPopover);

			linkNestedPopoverToParent(varPickerPopover, parentPopover);

			expect(isPopoverDismissIgnoredTarget(parentPopover, pointer)).toBe(
				true
			);
			expect(
				isPopoverDismissIgnoredTarget(varPickerPopover, pointer)
			).toBe(false);
			expect(
				shouldDismissPopoverFromPointerDown(
					parentPopover,
					pointer,
					null
				)
			).toBe(false);
			expect(
				shouldDismissPopoverFromPointerDown(
					varPickerPopover,
					pointer,
					null
				)
			).toBe(true);
		});

		it('keeps nested var-pickers open when selecting a variable item', () => {
			const parentPopover = document.createElement('div');
			parentPopover.className = 'blockera-component-popover';
			document.body.appendChild(parentPopover);

			const outerVarPicker = document.createElement('div');
			outerVarPicker.className =
				'blockera-component-popover blockera-control-popover-variables';
			const outerContent = document.createElement('div');
			outerContent.dataset.test = 'variable-picker-popover';
			outerVarPicker.appendChild(outerContent);
			document.body.appendChild(outerVarPicker);

			const presetPopover = document.createElement('div');
			presetPopover.className = 'blockera-component-popover';
			document.body.appendChild(presetPopover);

			const innerVarPicker = document.createElement('div');
			innerVarPicker.className =
				'blockera-component-popover blockera-control-popover-variables';
			const innerContent = document.createElement('div');
			innerContent.dataset.test = 'variable-picker-popover';
			const variableItem = document.createElement('button');
			variableItem.className =
				'blockera-control-value-addon-popover-item';
			variableItem.dataset.test = 'value-addon-picker-item-color-1';
			innerContent.appendChild(variableItem);
			innerVarPicker.appendChild(innerContent);
			document.body.appendChild(innerVarPicker);

			linkNestedPopoverToParent(outerVarPicker, parentPopover);
			linkNestedPopoverToParent(presetPopover, outerVarPicker);
			linkNestedPopoverToParent(innerVarPicker, presetPopover);

			expect(
				isElementInsideVariablePickerSelectionTarget(variableItem)
			).toBe(true);
			expect(
				isPopoverDismissIgnoredTarget(outerVarPicker, variableItem)
			).toBe(true);
			expect(
				isPopoverDismissIgnoredTarget(presetPopover, variableItem)
			).toBe(true);
			expect(
				isPopoverDismissIgnoredTarget(parentPopover, variableItem)
			).toBe(true);
			expect(
				shouldDismissPopoverFromPointerDown(
					outerVarPicker,
					variableItem,
					null
				)
			).toBe(false);
			expect(
				shouldDismissPopoverFromPointerDown(
					innerVarPicker,
					variableItem,
					null
				)
			).toBe(false);
		});

		it('allows variable selection when nested var-picker parent link is missing', () => {
			const outerVarPicker = document.createElement('div');
			outerVarPicker.className =
				'blockera-component-popover blockera-control-popover-variables';
			document.body.appendChild(outerVarPicker);

			const innerVarPicker = document.createElement('div');
			innerVarPicker.className =
				'blockera-component-popover blockera-control-popover-variables';
			const innerContent = document.createElement('div');
			innerContent.dataset.test = 'variable-picker-popover';
			const variableItem = document.createElement('button');
			variableItem.className =
				'blockera-control-value-addon-popover-item';
			innerContent.appendChild(variableItem);
			innerVarPicker.appendChild(innerContent);
			document.body.appendChild(innerVarPicker);

			expect(
				isPopoverDismissIgnoredTarget(outerVarPicker, variableItem)
			).toBe(true);
			expect(
				shouldDismissPopoverFromPointerDown(
					outerVarPicker,
					variableItem,
					null
				)
			).toBe(false);
		});

		it('does not treat edit-variable repeater popovers as var-picker surfaces', () => {
			const parentPopover = document.createElement('div');
			parentPopover.className = 'blockera-component-popover';
			document.body.appendChild(parentPopover);

			const editPopover = document.createElement('div');
			editPopover.className =
				'blockera-component-popover blockera-control-popover-variables';
			const field = document.createElement('input');
			editPopover.appendChild(field);
			document.body.appendChild(editPopover);

			expect(isElementInsideVariablePickerPopover(field)).toBe(false);
			expect(isPopoverDismissIgnoredTarget(parentPopover, field)).toBe(
				false
			);
			expect(
				shouldDismissPopoverFromPointerDown(parentPopover, field, null)
			).toBe(true);
		});

		it('keeps outer var-picker open when clicking repeater rows in nested var-picker', () => {
			const outerVarPicker = document.createElement('div');
			outerVarPicker.className =
				'blockera-component-popover blockera-control-popover-variables';
			document.body.appendChild(outerVarPicker);

			const innerVarPicker = document.createElement('div');
			innerVarPicker.className =
				'blockera-component-popover blockera-control-popover-variables';
			const innerContent = document.createElement('div');
			innerContent.dataset.test = 'variable-picker-popover';
			const repeaterRow = document.createElement('button');
			repeaterRow.className =
				'blockera-control-inner-repeater-group-header';
			innerContent.appendChild(repeaterRow);
			innerVarPicker.appendChild(innerContent);
			document.body.appendChild(innerVarPicker);

			expect(
				isPopoverDismissIgnoredTarget(outerVarPicker, repeaterRow)
			).toBe(true);
			expect(
				shouldDismissPopoverFromPointerDown(
					outerVarPicker,
					repeaterRow,
					null
				)
			).toBe(false);
		});

		it('isPopoverDismissIgnoredTarget keeps the popover open for Blockera modals opened from parent', () => {
			const popover = document.createElement('div');
			popover.className = 'blockera-component-popover';
			const modalOpener = document.createElement('button');
			popover.appendChild(modalOpener);
			document.body.appendChild(popover);

			const overlay = document.createElement('div');
			overlay.className = 'components-modal__screen-overlay';
			const modalButton = document.createElement('button');
			overlay.appendChild(modalButton);
			document.body.appendChild(overlay);

			modalOpener.dispatchEvent(
				new MouseEvent('mousedown', { bubbles: true })
			);
			modalButton.dispatchEvent(
				new MouseEvent('mousedown', { bubbles: true })
			);

			expect(isPopoverDismissIgnoredTarget(popover, modalButton)).toBe(
				true
			);
		});

		it('isPopoverDismissIgnoredTarget associates a modal on focus-steal without another modal pointer event', () => {
			const popover = document.createElement('div');
			popover.className = 'blockera-component-popover';
			const modalOpener = document.createElement('button');
			popover.appendChild(modalOpener);
			document.body.appendChild(popover);

			modalOpener.dispatchEvent(
				new MouseEvent('mousedown', { bubbles: true })
			);

			const overlay = document.createElement('div');
			overlay.className = 'components-modal__screen-overlay';
			const modalButton = document.createElement('button');
			overlay.appendChild(modalButton);
			document.body.appendChild(overlay);

			// Modal mounts and steals focus before any mousedown inside it.
			expect(isPopoverDismissIgnoredTarget(popover, modalButton)).toBe(
				true
			);
		});

		it('isPopoverDismissIgnoredTarget keeps parent open for modals opened from a nested child popover', () => {
			const parentPopover = document.createElement('div');
			parentPopover.className = 'blockera-component-popover';
			document.body.appendChild(parentPopover);

			const nestedPopover = document.createElement('div');
			nestedPopover.className = 'blockera-component-popover';
			const modalOpener = document.createElement('button');
			nestedPopover.appendChild(modalOpener);
			document.body.appendChild(nestedPopover);

			linkNestedPopoverToParent(nestedPopover, parentPopover);

			modalOpener.dispatchEvent(
				new MouseEvent('mousedown', { bubbles: true })
			);

			const overlay = document.createElement('div');
			overlay.className = 'components-modal__screen-overlay';
			const modalButton = document.createElement('button');
			overlay.appendChild(modalButton);
			document.body.appendChild(overlay);

			expect(
				isPopoverDismissIgnoredTarget(nestedPopover, modalButton)
			).toBe(true);
			expect(
				isPopoverDismissIgnoredTarget(parentPopover, modalButton)
			).toBe(true);
		});

		it('isPopoverDismissIgnoredTarget keeps the popover open for media modals opened from parent', () => {
			const popover = document.createElement('div');
			popover.className = 'blockera-component-popover';
			const mediaOpener = document.createElement('button');
			mediaOpener.className = 'btn-choose-image';
			popover.appendChild(mediaOpener);
			document.body.appendChild(popover);

			const mediaModal = document.createElement('div');
			mediaModal.className = 'media-modal';
			const mediaToolbarButton = document.createElement('button');
			mediaToolbarButton.textContent = 'Select';
			mediaModal.appendChild(mediaToolbarButton);
			document.body.appendChild(mediaModal);

			mediaOpener.dispatchEvent(
				new MouseEvent('mousedown', { bubbles: true })
			);
			mediaToolbarButton.dispatchEvent(
				new MouseEvent('mousedown', { bubbles: true })
			);

			expect(
				isPopoverDismissIgnoredTarget(popover, mediaToolbarButton)
			).toBe(true);
		});

		it('isPopoverDismissIgnoredTarget keeps the popover open for media modal backdrop clicks', () => {
			const popover = document.createElement('div');
			popover.className = 'blockera-component-popover';
			const mediaOpener = document.createElement('button');
			mediaOpener.className = 'btn-media-library';
			popover.appendChild(mediaOpener);
			document.body.appendChild(popover);

			const mediaModal = document.createElement('div');
			mediaModal.className = 'media-modal';
			document.body.appendChild(mediaModal);

			const backdrop = document.createElement('div');
			backdrop.className = 'media-modal-backdrop';
			document.body.appendChild(backdrop);

			mediaOpener.dispatchEvent(
				new MouseEvent('mousedown', { bubbles: true })
			);
			backdrop.dispatchEvent(
				new MouseEvent('mousedown', { bubbles: true })
			);

			expect(isPopoverDismissIgnoredTarget(popover, backdrop)).toBe(true);
		});

		it('isPopoverDismissIgnoredTarget does not ignore unrelated modal overlays', () => {
			const popover = document.createElement('div');
			popover.className = 'blockera-component-popover';
			document.body.appendChild(popover);

			const overlay = document.createElement('div');
			overlay.className = 'components-modal__screen-overlay';
			const modalButton = document.createElement('button');
			overlay.appendChild(modalButton);
			document.body.appendChild(overlay);

			expect(isPopoverDismissIgnoredTarget(popover, modalButton)).toBe(
				false
			);
		});

		it('isPopoverDismissIgnoredTarget does not keep popovers open for unrelated modals after outside pointer', () => {
			const popover = document.createElement('div');
			popover.className = 'blockera-component-popover';
			const inside = document.createElement('button');
			popover.appendChild(inside);
			document.body.appendChild(popover);

			const outside = document.createElement('button');
			document.body.appendChild(outside);

			inside.dispatchEvent(
				new MouseEvent('mousedown', { bubbles: true })
			);
			outside.dispatchEvent(
				new MouseEvent('mousedown', { bubbles: true })
			);

			const overlay = document.createElement('div');
			overlay.className = 'components-modal__screen-overlay';
			const modalButton = document.createElement('button');
			overlay.appendChild(modalButton);
			document.body.appendChild(overlay);

			expect(isPopoverDismissIgnoredTarget(popover, modalButton)).toBe(
				false
			);
		});

		it('isPopoverDismissIgnoredTarget does not ignore unrelated media modals', () => {
			const popover = document.createElement('div');
			popover.className = 'blockera-component-popover';
			document.body.appendChild(popover);

			const mediaModal = document.createElement('div');
			mediaModal.className = 'media-modal';
			const mediaButton = document.createElement('button');
			mediaModal.appendChild(mediaButton);
			document.body.appendChild(mediaModal);

			expect(isPopoverDismissIgnoredTarget(popover, mediaButton)).toBe(
				false
			);
		});

		it('shouldIgnorePopoverFocusOutside falls back to activeElement for nested child popovers', () => {
			const popover = document.createElement('div');
			popover.className = 'blockera-component-popover';
			document.body.appendChild(popover);

			const nestedPopover = document.createElement('div');
			nestedPopover.className = 'blockera-component-popover';
			const nestedButton = document.createElement('button');
			nestedPopover.appendChild(nestedButton);
			document.body.appendChild(nestedPopover);

			linkNestedPopoverToParent(nestedPopover, popover);
			nestedButton.dispatchEvent(
				new MouseEvent('mousedown', { bubbles: true })
			);
			nestedButton.focus();

			const event = new FocusEvent('focusout', {
				relatedTarget: null,
			});

			expect(shouldIgnorePopoverFocusOutside(event, popover)).toBe(true);
		});

		it('shouldIgnorePopoverFocusOutside dismisses when pointer down was outside but focus stayed inside', () => {
			const popover = document.createElement('div');
			popover.className = 'blockera-component-popover';
			const inside = document.createElement('button');
			popover.appendChild(inside);
			document.body.appendChild(popover);

			const outside = document.createElement('button');
			document.body.appendChild(outside);

			inside.focus();

			outside.dispatchEvent(
				new MouseEvent('mousedown', { bubbles: true })
			);

			const event = new FocusEvent('focusout', {
				relatedTarget: null,
			});

			expect(shouldIgnorePopoverFocusOutside(event, popover)).toBe(false);
		});

		it('shouldDismissPopoverFromPointerDown dismisses for outside targets', () => {
			const popover = document.createElement('div');
			popover.className = 'blockera-component-popover';
			document.body.appendChild(popover);

			const outside = document.createElement('button');
			document.body.appendChild(outside);

			expect(
				shouldDismissPopoverFromPointerDown(popover, outside, null)
			).toBe(true);
		});

		it('shouldDismissPopoverFromPointerDown ignores the popover anchor', () => {
			const popover = document.createElement('div');
			popover.className = 'blockera-component-popover';
			document.body.appendChild(popover);

			const anchor = document.createElement('button');
			document.body.appendChild(anchor);

			expect(
				shouldDismissPopoverFromPointerDown(popover, anchor, anchor)
			).toBe(false);
		});

		it('shouldDismissPopoverFromPointerDown ignores nested popovers opened from parent', () => {
			const rootPopover = document.createElement('div');
			rootPopover.className = 'blockera-component-popover';
			document.body.appendChild(rootPopover);

			const nestedPopover = document.createElement('div');
			nestedPopover.className = 'blockera-component-popover';
			const nestedButton = document.createElement('button');
			nestedPopover.appendChild(nestedButton);
			document.body.appendChild(nestedPopover);

			linkNestedPopoverToParent(nestedPopover, rootPopover);

			expect(
				shouldDismissPopoverFromPointerDown(
					rootPopover,
					nestedButton,
					null
				)
			).toBe(false);
		});

		it('registerPopoverOpen links a child popover to the last in-popover interaction', () => {
			const rootPopover = document.createElement('div');
			rootPopover.className = 'blockera-component-popover';
			const opener = document.createElement('button');
			rootPopover.appendChild(opener);
			document.body.appendChild(rootPopover);

			const nestedPopover = document.createElement('div');
			nestedPopover.className = 'blockera-component-popover';
			const nestedButton = document.createElement('button');
			nestedPopover.appendChild(nestedButton);
			document.body.appendChild(nestedPopover);

			opener.dispatchEvent(
				new MouseEvent('mousedown', { bubbles: true })
			);
			registerPopoverOpen(nestedPopover);

			expect(
				isPopoverDismissIgnoredTarget(rootPopover, nestedButton)
			).toBe(true);
		});

		it('shouldDismissPopoverFromPointerDown dismisses when target is only inside a WordPress popover wrapper', () => {
			const rootPopover = document.createElement('div');
			rootPopover.className =
				'components-popover blockera-component-popover';
			document.body.appendChild(rootPopover);

			const sidebarWrapper = document.createElement('div');
			sidebarWrapper.className = 'components-popover';
			const blockStateHeader = document.createElement('button');
			blockStateHeader.textContent = 'Hover';
			sidebarWrapper.appendChild(blockStateHeader);
			document.body.appendChild(sidebarWrapper);

			expect(
				shouldDismissPopoverFromPointerDown(
					rootPopover,
					blockStateHeader,
					null
				)
			).toBe(true);
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

		it('shouldIgnorePopoverFocusOutside ignores sketch-picker drag interaction', () => {
			const popover = document.createElement('div');
			popover.className = 'blockera-component-popover';
			const sketchPicker = document.createElement('div');
			sketchPicker.className = 'sketch-picker';
			popover.appendChild(sketchPicker);
			document.body.appendChild(popover);

			sketchPicker.dispatchEvent(
				new MouseEvent('mousedown', { bubbles: true })
			);

			const event = new FocusEvent('focusout', {
				relatedTarget: null,
			});

			expect(isSketchPickerInteractionActiveFor(popover)).toBe(true);
			expect(shouldIgnorePopoverFocusOutside(event, popover)).toBe(true);

			document.dispatchEvent(
				new MouseEvent('mouseup', { bubbles: true })
			);

			expect(isSketchPickerInteractionActiveFor(popover)).toBe(false);
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

			linkNestedPopoverToParent(nestedPopover, parentPopover);

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
