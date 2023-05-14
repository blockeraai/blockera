/**
 * External dependencies
 */
import { isObject } from 'lodash';

/**
 * Internal dependencies
 */
import { getClassNames } from '@publisher/classnames';

export function useExtendedProps(
	defaultProps: Object,
	extensionProps: Object
): Object {
	for (const key in extensionProps) {
		if (!Object.hasOwnProperty.call(extensionProps, key)) {
			continue;
		}

		const newProp = extensionProps[key];

		if ('className' === key) {
			defaultProps = {
				...defaultProps,
				className: getClassNames(
					defaultProps?.className || '',
					newProp
				),
			};

			continue;
		}

		if (!defaultProps[key]) {
			defaultProps[key] = newProp;

			continue;
		}

		defaultProps = {
			...defaultProps,
			[key]: {
				...defaultProps[key],
				...newProp,
			},
		};
	}

	return defaultProps;
}
