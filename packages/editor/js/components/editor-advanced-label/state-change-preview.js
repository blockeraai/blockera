// @flow

/**
 * External dependencies
 */
import { isValidElement } from '@wordpress/element';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import {
	ColorIndicator,
	getValueAddonRealValue,
	isValid as isValidValueAddon,
} from '@blockera/controls';
import { isObject } from '@blockera/utils';

export type StateGraphPreviewConfig = {
	type: string,
	indicatorType?: string,
	...
};

/**
 * When the graph resolves the whole attribute object (e.g. gap), pick the sub-field
 * named by singularId / control id (e.g. `rows`, `columns`) for preview.
 */
export const pickPreviewSubfield = (
	raw: mixed,
	objectPickKey?: ?string
): mixed => {
	if (!objectPickKey || typeof objectPickKey !== 'string') {
		return raw;
	}

	if (
		isObject(raw) &&
		Object.prototype.hasOwnProperty.call(raw, objectPickKey)
	) {
		return raw[objectPickKey];
	}

	return raw;
};

const formatStringPreview = (raw: mixed): string => {
	if (raw === null || raw === undefined) {
		return '';
	}

	if (isObject(raw) && isValidValueAddon(raw)) {
		return formatStringPreview(getValueAddonRealValue(raw));
	}

	if (
		typeof raw === 'string' ||
		typeof raw === 'number' ||
		typeof raw === 'boolean'
	) {
		return String(raw);
	}

	if (isObject(raw) && typeof raw.value !== 'undefined') {
		return formatStringPreview(raw.value);
	}

	return String(raw);
};

type Props = {
	previewConfig: void | null | StateGraphPreviewConfig,
	value: mixed,
	/** Prefer `singularId`, else control `id` (via `controlFieldId` on label props). */
	objectPickKey?: ?string,
	changesetGraphPreviewRender?: ?(value: mixed) => mixed,
};

/**
 * Renders a small preview for a state-graph row when `changesetGraphPreview` is set on the attribute (PHP).
 */
export default function StateChangePreview({
	previewConfig,
	value,
	objectPickKey,
	changesetGraphPreviewRender: previewRender,
}: Props): null | MixedElement {
	const resolvedValue = pickPreviewSubfield(value, objectPickKey);

	// Custom render first; empty result falls through to `changesetGraphPreview.type` when set.
	if (typeof previewRender === 'function') {
		const custom = previewRender(resolvedValue);

		if (
			custom !== null &&
			custom !== undefined &&
			custom !== false &&
			custom !== '' &&
			!(typeof custom === 'number' && Number.isNaN(custom))
		) {
			if (isValidElement(custom)) {
				return custom;
			}

			const text =
				typeof custom === 'string' || typeof custom === 'number'
					? String(custom)
					: formatStringPreview(custom);

			if (text !== '') {
				return (
					<span
						className="blockera-control-states-changes-item__preview-string"
						title={text}
					>
						{text}
					</span>
				);
			}
		}
	}

	if (!previewConfig || typeof previewConfig.type !== 'string') {
		return null;
	}

	switch (previewConfig.type) {
		case 'color': {
			const indicatorType = previewConfig.indicatorType ?? 'color';

			return (
				<ColorIndicator
					value={resolvedValue}
					type={indicatorType}
					size={14}
					className="blockera-control-states-changes-item__preview-indicator"
				/>
			);
		}

		case 'string': {
			const text = formatStringPreview(resolvedValue);

			if (text === '') {
				return null;
			}

			return (
				<span
					className="blockera-control-states-changes-item__preview-string"
					title={text}
				>
					{text}
				</span>
			);
		}

		default:
			return null;
	}
}
