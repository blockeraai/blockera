// @flow

/**
 * Blockera dependencies
 */
import { isUndefined } from '@blockera/utils';

export const coreWPAspectRatioValues = [
	'1',
	'4/3',
	'3/4',
	'3/2',
	'2/3',
	'16/9',
	'9/16',
];

export function ratioFromWPCompatibility({
	attributes,
	blockId,
}: {
	attributes: Object,
	blockId?: string,
}): Object {
	if (attributes?.blockeraRatio?.value !== '') {
		return attributes;
	}

	switch (blockId) {
		case 'core/post-featured-image':
		case 'core/image':
			if (!isUndefined(attributes?.aspectRatio)) {
				const ratio = detectWPAspectRatioValue(attributes.aspectRatio);

				if (ratio?.value) {
					attributes.blockeraRatio = ratio;
				}
			}

			return attributes;

		case 'core/cover':
			if (!isUndefined(attributes?.style?.dimensions?.aspectRatio)) {
				const _ratio = detectWPAspectRatioValue(
					attributes.style.dimensions.aspectRatio
				);

				if (_ratio?.value) {
					attributes.blockeraRatio = _ratio;
				}
			}

			return attributes;
	}

	return attributes;
}

export function ratioToWPCompatibility({
	newValue,
	ref,
	blockId,
}: {
	newValue: Object,
	ref?: Object,
	blockId: string,
}): Object {
	switch (blockId) {
		case 'core/cover':
			if ('reset' === ref?.current?.action) {
				return {
					style: { dimensions: { aspectRatio: undefined } },
				};
			}

			if (
				newValue === undefined ||
				newValue === '' ||
				newValue?.value === ''
			) {
				return {
					style: { dimensions: { aspectRatio: undefined } },
				};
			}

			const _convertedRatio = convertAspectRatioValueToWP(newValue);

			if (!_convertedRatio) {
				return {
					style: { dimensions: { aspectRatio: undefined } },
				};
			}

			return {
				style: { dimensions: { aspectRatio: _convertedRatio } },
			};

		case 'core/post-featured-image':
		case 'core/image':
			if ('reset' === ref?.current?.action) {
				return {
					aspectRatio: undefined,
				};
			}

			if (
				newValue === undefined ||
				newValue === '' ||
				newValue?.value === ''
			) {
				return {
					aspectRatio: undefined,
				};
			}

			const convertedRatio = convertAspectRatioValueToWP(newValue);

			if (!convertedRatio) {
				return {
					aspectRatio: undefined,
				};
			}

			return {
				aspectRatio: convertedRatio,
			};
	}

	return null;
}

export function detectWPAspectRatioValue(aspectRatio: string): {
	value: string,
	width: '' | string,
	height: '' | string,
} {
	if (!aspectRatio || aspectRatio === 'auto') {
		return {
			value: '',
			width: '',
			height: '',
		};
	}

	// Check if input matches predefined aspect ratios
	if (coreWPAspectRatioValues.includes(aspectRatio)) {
		return {
			value: aspectRatio,
			width: '',
			height: '',
		};
	}

	// If it's a custom aspect ratio, assume it's in the format 'width/height'
	if (aspectRatio.includes('/')) {
		const [width, height] = aspectRatio
			.split('/')
			.map((part) => part.trim());

		return {
			value: 'custom',
			width: width || '',
			height: height || '',
		};
	}

	return {
		value: 'custom',
		width: aspectRatio,
		height: aspectRatio,
	};
}

export function convertAspectRatioValueToWP(aspectRatio: {
	value: string,
	width: '' | string,
	height: '' | string,
}): string {
	if (!aspectRatio?.value) {
		return '';
	}

	if (aspectRatio?.value !== 'custom') {
		return aspectRatio?.value;
	}

	if (aspectRatio?.width === aspectRatio?.height) {
		return aspectRatio?.width;
	}

	return aspectRatio?.width + '/' + aspectRatio?.height;
}
