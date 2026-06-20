import {
	computeInspectorPopoverOffset,
	DEFAULT_POPOVER_OFFSET,
	getInspectorSidebarElement,
	resolvePopoverAnchorElement,
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
});
