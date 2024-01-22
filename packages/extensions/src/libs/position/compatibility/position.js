// @flow

/**
 * Publisher dependencies
 */
import { isEmpty, isUndefined } from '@publisher/utils';

export function positionFromWPCompatibility({
	attributes,
	blockId,
}: {
	attributes: Object,
	blockId?: string,
}): Object {
	switch (blockId) {
		case 'core/group':
			if (
				attributes?.publisherPosition?.type === undefined &&
				attributes?.style?.position?.type !== undefined &&
				attributes.publisherPosition?.type !==
					attributes?.style?.position?.type
			) {
				attributes.publisherPosition = {
					type: attributes?.style?.position?.type || '',
					position: {
						top: attributes?.style?.position?.top || '',
						right: attributes?.style?.position?.right || '',
						bottom: attributes?.style?.position?.bottom || '',
						left: attributes?.style?.position?.left || '',
					},
				};
			}
	}

	return attributes;
}

export function positionToWPCompatibility({
	newValue,
	ref,
	blockId,
}: {
	newValue: Object,
	ref?: Object,
	blockId: string,
}): Object {
	switch (blockId) {
		case 'core/group':
			if ('reset' === ref?.current?.action) {
				return {
					style: {
						position: undefined,
					},
				};
			}

			if (isEmpty(newValue) || isUndefined(newValue)) {
				return {
					style: {
						position: undefined,
					},
				};
			}

			return {
				style: {
					position: {
						type: newValue.type,
						top: newValue?.position?.top,
						right: newValue?.position?.right,
						bottom: newValue?.position?.bottom,
						left: newValue?.position?.left,
					},
				},
			};
	}

	return {};
}
