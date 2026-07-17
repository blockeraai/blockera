import {
	prepValueForHeader,
	getArialLabelSuffix,
	isClickInsideOpenInspectorRepeaterPopover,
	isRepeaterPromoActive,
	shouldApplyRepeaterItemNativeStyle,
	shouldGateRepeaterItemHeaderForPromo,
	shouldPreserveRepeaterPopoverForNestedOpen,
} from '../utils';
import { linkNestedPopoverToParent } from '../../popover/utils';

describe('Util functions', () => {
	describe('prepValueForHeader', () => {
		test('empty', () => {
			expect(prepValueForHeader('')).toStrictEqual('');
		});

		test('boolean', () => {
			expect(prepValueForHeader(false)).toStrictEqual(
				<span className="unit-value unit-value-css">CSS</span>
			);
		});

		test('px value', () => {
			expect(prepValueForHeader('1px')).toStrictEqual(
				<span className="unit-value">1px</span>
			);
		});

		test('em value', () => {
			expect(prepValueForHeader('1em')).toStrictEqual(
				<span className="unit-value">1em</span>
			);
		});

		test('rem value', () => {
			expect(prepValueForHeader('1rem')).toStrictEqual(
				<span className="unit-value">1rem</span>
			);
		});

		test('func value', () => {
			expect(prepValueForHeader('1remfunc')).toStrictEqual(
				<span className="unit-value unit-value-css">CSS</span>
			);
		});

		test('wrong func value', () => {
			expect(prepValueForHeader('func')).toStrictEqual(
				<span className="unit-value unit-value-css">CSS</span>
			);
		});

		test('special value', () => {
			expect(prepValueForHeader('initial')).toStrictEqual(
				<span className="unit-value unit-value-special">initial</span>
			);
		});

		test('deg value', () => {
			expect(prepValueForHeader('12deg')).toStrictEqual(
				<span className="unit-value">12°</span>
			);
		});

		test('rad value', () => {
			expect(prepValueForHeader('12rad')).toStrictEqual(
				<span className="unit-value">12°</span>
			);
		});

		test('grad value', () => {
			expect(prepValueForHeader('12grad')).toStrictEqual(
				<span className="unit-value">12°</span>
			);
		});
	});

	describe('getArialLabelSuffix', () => {
		test('empty', () => {
			expect(getArialLabelSuffix('')).toStrictEqual('');
		});

		test('string with space in start and end', () => {
			expect(getArialLabelSuffix('  test   ')).toStrictEqual('test');
		});

		test('string with space in start and end after removing not allowed chars', () => {
			expect(getArialLabelSuffix('--  test   --')).toStrictEqual('test');
		});

		test('not allowed strings between other words', () => {
			expect(getArialLabelSuffix('this-is-test')).toStrictEqual(
				'this is test'
			);
		});
	});
});

describe('isClickInsideOpenInspectorRepeaterPopover', () => {
	function createInspectorSidebar() {
		const sidebar = document.createElement('div');
		sidebar.className = 'interface-interface-skeleton__sidebar';
		document.body.appendChild(sidebar);
		return sidebar;
	}

	function createOpenRepeaterEditSession(sidebar) {
		const repeaterItem = document.createElement('div');
		repeaterItem.className = 'blockera-control-repeater-item';

		const group = document.createElement('div');
		group.className =
			'blockera-control blockera-control-group is-open mode-popover';

		const header = document.createElement('div');
		header.dataset.cy = 'group-control-header';

		const popover = document.createElement('div');
		popover.className =
			'blockera-component blockera-component-popover blockera-control-group-popover';
		popover.innerHTML =
			'<div data-test="popover-body"><button type="button">Edit field</button></div>';

		group.appendChild(header);
		repeaterItem.appendChild(group);
		sidebar.appendChild(repeaterItem);
		document.body.appendChild(popover);

		return {
			popover,
			control: popover.querySelector('button'),
		};
	}

	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('returns true for targets inside an open repeater group edit popover', () => {
		const sidebar = createInspectorSidebar();
		const { control } = createOpenRepeaterEditSession(sidebar);

		expect(isClickInsideOpenInspectorRepeaterPopover(control)).toBe(true);
	});

	it('returns true for variations rows with standalone group-popover edit surfaces', () => {
		const sidebar = createInspectorSidebar();

		const repeaterItem = document.createElement('div');
		repeaterItem.className = 'blockera-control-repeater-item';
		repeaterItem.dataset.editPopoverOpen = 'true';
		sidebar.appendChild(repeaterItem);

		const popover = document.createElement('div');
		popover.className =
			'blockera-component blockera-component-popover blockera-control-group-popover';
		const toggle = document.createElement('button');
		toggle.type = 'button';
		toggle.className = 'components-form-toggle';
		popover.appendChild(toggle);
		document.body.appendChild(popover);

		expect(isClickInsideOpenInspectorRepeaterPopover(toggle)).toBe(true);
	});

	it('returns true for nested Blockera popovers opened during the edit session', () => {
		const sidebar = createInspectorSidebar();
		const { popover } = createOpenRepeaterEditSession(sidebar);

		const nestedPopover = document.createElement('div');
		nestedPopover.className =
			'blockera-component blockera-component-popover blockera-color-picker-popover';
		const nestedControl = document.createElement('button');
		nestedControl.type = 'button';
		nestedPopover.appendChild(nestedControl);
		document.body.appendChild(nestedPopover);

		linkNestedPopoverToParent(nestedPopover, popover);

		expect(isClickInsideOpenInspectorRepeaterPopover(nestedControl)).toBe(
			true
		);
	});

	it('returns false for nested var-picker selections while a repeater edit popover is open', () => {
		const sidebar = createInspectorSidebar();
		createOpenRepeaterEditSession(sidebar);

		const varPickerPopover = document.createElement('div');
		varPickerPopover.className =
			'blockera-component-popover blockera-control-popover-variables';
		const varPickerContent = document.createElement('div');
		varPickerContent.dataset.test = 'variable-picker-popover';
		const repeaterRow = document.createElement('button');
		repeaterRow.className = 'blockera-control-inner-repeater-group-header';
		const variableItem = document.createElement('button');
		variableItem.className = 'blockera-control-value-addon-popover-item';
		varPickerContent.appendChild(repeaterRow);
		varPickerContent.appendChild(variableItem);
		varPickerPopover.appendChild(varPickerContent);
		document.body.appendChild(varPickerPopover);

		expect(isClickInsideOpenInspectorRepeaterPopover(repeaterRow)).toBe(
			false
		);
		expect(isClickInsideOpenInspectorRepeaterPopover(variableItem)).toBe(
			false
		);
	});

	it('returns false for unrelated WordPress popovers while a repeater edit popover is open', () => {
		const sidebar = createInspectorSidebar();
		createOpenRepeaterEditSession(sidebar);

		const blockStatePopover = document.createElement('div');
		blockStatePopover.className = 'components-popover';
		const blockStateButton = document.createElement('button');
		blockStateButton.type = 'button';
		blockStatePopover.appendChild(blockStateButton);
		document.body.appendChild(blockStatePopover);

		expect(
			isClickInsideOpenInspectorRepeaterPopover(blockStateButton)
		).toBe(false);
	});

	it('returns false when no repeater edit popover session is open', () => {
		const sidebar = createInspectorSidebar();
		const popover = document.createElement('div');
		popover.className =
			'blockera-component blockera-component-popover blockera-control-group-popover';
		const control = document.createElement('button');
		popover.appendChild(control);
		sidebar.appendChild(popover);

		expect(isClickInsideOpenInspectorRepeaterPopover(control)).toBe(false);
	});

	it('returns false for targets outside open popovers', () => {
		const sidebar = createInspectorSidebar();
		createOpenRepeaterEditSession(sidebar);

		const header = document.createElement('button');
		sidebar.appendChild(header);

		expect(isClickInsideOpenInspectorRepeaterPopover(header)).toBe(false);
	});
});

describe('shouldPreserveRepeaterPopoverForNestedOpen', () => {
	function createParentRepeaterWithNestedRow() {
		const parentItemRef = document.createElement('div');
		parentItemRef.className = 'blockera-control-inner-repeater-item';

		const group = document.createElement('div');
		group.className =
			'blockera-control blockera-control-group is-open mode-popover';

		parentItemRef.appendChild(group);

		const parentPopover = document.createElement('div');
		parentPopover.className =
			'blockera-component blockera-component-popover blockera-control-group-popover';
		const nestedItemRef = document.createElement('div');
		nestedItemRef.className = 'blockera-control-inner-repeater-item';
		nestedItemRef.dataset.cy = 'repeater-item';
		parentPopover.appendChild(nestedItemRef);
		document.body.appendChild(parentPopover);

		return { parentItemRef, nestedItemRef, parentPopover };
	}

	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('returns true when a nested row opens inside the parent edit popover', () => {
		const { parentItemRef, nestedItemRef } =
			createParentRepeaterWithNestedRow();

		expect(
			shouldPreserveRepeaterPopoverForNestedOpen(
				parentItemRef,
				nestedItemRef
			)
		).toBe(true);
	});

	it('returns false when the parent row is not open', () => {
		const { parentItemRef, nestedItemRef } =
			createParentRepeaterWithNestedRow();
		const group = parentItemRef.querySelector('.blockera-control-group');
		group?.classList.remove('is-open');

		expect(
			shouldPreserveRepeaterPopoverForNestedOpen(
				parentItemRef,
				nestedItemRef
			)
		).toBe(false);
	});

	it('returns false for unrelated repeater rows', () => {
		const { parentItemRef } = createParentRepeaterWithNestedRow();
		const siblingItemRef = document.createElement('div');
		siblingItemRef.className = 'blockera-control-inner-repeater-item';
		document.body.appendChild(siblingItemRef);

		expect(
			shouldPreserveRepeaterPopoverForNestedOpen(
				parentItemRef,
				siblingItemRef
			)
		).toBe(false);
	});
});

describe('repeater promo helpers', () => {
	const items = {
		'first-0': { type: 'first', order: 0 },
		'first-1': { type: 'first', order: 1 },
	};

	const PromoWidgetStub = () => <span>Promo</span>;

	it('isRepeaterPromoActive returns false when PromoComponent is null', () => {
		expect(isRepeaterPromoActive(null, items, false)).toBe(false);
	});

	it('isRepeaterPromoActive returns false when disableProHints is true', () => {
		expect(isRepeaterPromoActive(PromoWidgetStub, items, true)).toBe(false);
	});

	it('isRepeaterPromoActive returns true when promo component renders', () => {
		expect(isRepeaterPromoActive(PromoWidgetStub, items, false)).toBe(true);
	});

	it('shouldGateRepeaterItemHeaderForPromo returns false when promo is inactive', () => {
		expect(
			shouldGateRepeaterItemHeaderForPromo(
				'first-1',
				{ type: 'first', order: 1 },
				items,
				true,
				false
			)
		).toBe(false);
	});

	it('shouldApplyRepeaterItemNativeStyle returns false when promo is inactive', () => {
		expect(
			shouldApplyRepeaterItemNativeStyle(
				'first-1',
				{ type: 'first', order: 1 },
				items,
				true,
				false
			)
		).toBe(false);
	});

	it('shouldGateRepeaterItemHeaderForPromo gates second generic item when promo is active', () => {
		expect(
			shouldGateRepeaterItemHeaderForPromo(
				'first-1',
				{ type: 'first', order: 1 },
				items,
				true,
				true
			)
		).toBe(true);
	});
});
