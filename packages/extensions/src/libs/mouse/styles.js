// @flow
/**
 * Publisher dependencies
 */
import { computedCssRules } from '@publisher/style-engine';

/**
 * Internal dependencies
 */
import { attributes } from './attributes';
import type { TBlockProps } from '../types';
import { useCssSelector } from '../../hooks';
import { isActiveField } from '../../api/utils';
import type { TMouseCssProps } from './types/mouse-props';

interface IConfigs {
	mouseConfig: {
		publisherCursor: string,
		publisherUserSelect: string,
		publisherPointerEvents: string,
	};
	blockProps: TBlockProps;
}

export function MouseStyles({
	mouseConfig: {
		cssGenerators,
		publisherCursor,
		publisherUserSelect,
		publisherPointerEvents,
	},
	blockProps,
}: IConfigs): string {
	const { attributes: currBlockAttributes, blockName } = blockProps;
	const selector = useCssSelector({
		blockName,
		supportId: 'publisherMouse',
	});

	const generators = [];
	const properties: TMouseCssProps = {};

	if (
		isActiveField(publisherCursor) &&
		currBlockAttributes.publisherCursor !==
			attributes.publisherCursor.default
	) {
		properties.cursor = currBlockAttributes.publisherCursor;
	}

	if (
		isActiveField(publisherUserSelect) &&
		currBlockAttributes.publisherUserSelect !==
			attributes.publisherUserSelect.default
	) {
		properties['user-select'] = currBlockAttributes.publisherUserSelect;
	}

	if (
		isActiveField(publisherPointerEvents) &&
		currBlockAttributes.publisherPointerEvents !==
			attributes.publisherPointerEvents.default
	) {
		properties['pointer-events'] =
			currBlockAttributes.publisherPointerEvents;
	}

	if (Object.keys(properties).length > 0) {
		generators.push(
			computedCssRules(
				{
					cssGenerators: {
						publisherMouse: [
							{
								type: 'static',
								selector,
								properties,
								options: {
									important: true,
								},
							},
						],
					},
				},
				blockProps
			)
		);
	}

	generators.push(
		computedCssRules(
			{
				cssGenerators: {
					...(cssGenerators || {}),
				},
			},
			blockProps
		)
	);

	return generators.length > 1 ? generators.join('\n') : generators.join('');
}
