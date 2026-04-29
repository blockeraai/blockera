type BreakpointSchemaItem = {
	id: string;
	label: string;
	isBase: boolean;
	minWidth?: string;
	maxWidth?: string;
};

export type SiteBreakpointsExport = {
	breakpoints: BreakpointSchemaItem[];
};

type EditorBreakpoint = {
	type?: string;
	label?: string;
	base?: boolean;
	status?: boolean;
	settings?: {
		min?: string;
		max?: string;
	};
};

function isNonEmptyPx(value: unknown): value is string {
	return (
		typeof value === 'string' &&
		/^[0-9]+px$/.test(value.trim()) &&
		!value.includes('func')
	);
}

function numericPx(value: string): number {
	return parseInt(value, 10) || 0;
}

function sortBreakpoints(
	breakpoints: Array<[string, EditorBreakpoint]>
): Array<[string, EditorBreakpoint]> {
	const withSortMeta = breakpoints.map(([id, bp]) => {
		const min = bp?.settings?.min || '';
		const max = bp?.settings?.max || '';
		const hasMin = isNonEmptyPx(min);
		const hasMax = isNonEmptyPx(max);

		let category = 3;
		let sortValue = 0;

		if (bp?.base) {
			category = 2;
		} else if (hasMin && !hasMax) {
			category = 1;
			sortValue = -numericPx(min);
		} else if (!hasMin && hasMax) {
			category = 3;
			sortValue = -numericPx(max);
		} else if (hasMin && hasMax) {
			category = 4;
			sortValue = numericPx(max);
		}

		return { id, bp, category, sortValue };
	});

	withSortMeta.sort((a, b) => {
		if (a.category !== b.category) {
			return a.category - b.category;
		}
		return a.sortValue - b.sortValue;
	});

	return withSortMeta.map(({ id, bp }) => [id, bp]);
}

export function buildSiteBreakpointsJson(
	breakpointsInput: Record<string, EditorBreakpoint> | null | undefined
): SiteBreakpointsExport {
	const breakpoints = breakpointsInput || {};
	const enabledEntries: Array<[string, EditorBreakpoint]> = [];

	for (const id in breakpoints) {
		const bp = breakpoints[id];
		if (!bp || typeof bp !== 'object') {
			continue;
		}
		if (bp.status !== true) {
			continue;
		}
		enabledEntries.push([id, bp]);
	}

	const sorted = sortBreakpoints(enabledEntries);
	const output: BreakpointSchemaItem[] = [];

	for (const [fallbackId, bp] of sorted) {
		const idRaw = typeof bp.type === 'string' ? bp.type : fallbackId;
		const id = idRaw.trim();
		if (!id) {
			continue;
		}

		const labelRaw = typeof bp.label === 'string' ? bp.label : id;
		const label = labelRaw.trim() || id;

		const item: BreakpointSchemaItem = {
			id,
			label,
			isBase: bp.base === true,
		};

		const min = bp?.settings?.min;
		const max = bp?.settings?.max;
		if (isNonEmptyPx(min)) {
			item.minWidth = min.trim();
		}
		if (isNonEmptyPx(max)) {
			item.maxWidth = max.trim();
		}

		output.push(item);
	}

	return { breakpoints: output };
}
