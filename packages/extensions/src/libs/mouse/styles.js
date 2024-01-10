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
import { isActiveField } from '../../api/utils';
import type { TCssProps } from './types/mouse-props';

interface IConfigs {
	mouseConfig: {
		cssGenerators: Object,
		publisherCursor: string,
		publisherUserSelect: string,
		publisherPointerEvents: string,
	};
	blockProps: TBlockProps;
	selector: string;
	media: string;
}

export function MouseStyles({
	mouseConfig: {
		cssGenerators,
		publisherCursor,
		publisherUserSelect,
		publisherPointerEvents,
	},
	blockProps,
	selector,
	media,
}: IConfigs): string {
	const { attributes: currBlockAttributes } = blockProps;
	const generators = [];
	const properties: TCssProps = {};

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
					publisherMouse: [
						{
							type: 'static',
							media,
							selector,
							properties,
							options: {
								important: true,
							},
						},
					],
				},
				blockProps
			)
		);
	}

	generators.push(
		computedCssRules(
			{
				...(cssGenerators || {}),
			},
			blockProps
		)
	);

	return generators.length > 1 ? generators.join('\n') : generators.join('');
}
