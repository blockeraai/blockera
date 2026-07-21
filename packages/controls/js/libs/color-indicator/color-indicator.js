//@flow

/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import type { Node } from 'react';

/**
 * Blockera dependencies
 */
import { isObject } from '@blockera/utils';
import { componentClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import {
	getValueAddonRealValue,
	isValid as isValidVariable,
} from '../../value-addons';
import { getContextualColorKeywordMeta } from './get-contextual-color-keyword-meta';
import type { ColorIndicatorProps } from './types';

export default function ColorIndicator({
	className,
	value = '',
	type = 'color',
	size = 16,
	style,
	title,
	'aria-label': ariaLabel,
	children,
	...props
}: ColorIndicatorProps): Node {
	if (isObject(value) && isValidVariable(value)) {
		value = getValueAddonRealValue(value);
	}

	const contextualColorMeta =
		type === '' || type === 'color'
			? getContextualColorKeywordMeta(value)
			: null;

	const customStyle: {
		width?: string,
		height?: string,
		background?: string,
		backgroundImage?: string,
		backgroundPosition?: string,
		backgroundSize?: string,
		'--blockera-color-indicator-size'?: string,
	} = {};

	let styleClassName = '';

	if (size !== 16) {
		customStyle.width = Number(size) + 'px';
		customStyle.height = Number(size) + 'px';
	}

	switch (type) {
		case '':
		case 'color': {
			if (contextualColorMeta) {
				customStyle['--blockera-color-indicator-size'] =
					Number(size) + 'px';
				styleClassName = 'color-contextual-keyword';
			} else if (value !== '' && value !== 'none') {
				customStyle.background = value;
				styleClassName = 'color-custom';
			} else {
				styleClassName = 'color-none';
			}
			break;
		}

		case 'image':
			if (value !== '' && value !== 'none') {
				customStyle.backgroundImage = `url(${value})`;
				styleClassName = 'image-custom';
			} else {
				styleClassName = 'image-none';
			}
			break;

		case 'gradient':
			if (value !== '' && value !== 'none') {
				customStyle.backgroundImage = value;
				styleClassName = 'gradient-custom';
			} else {
				styleClassName = 'gradient-none';
			}
			break;

		default:
			return <></>;
	}

	const contextualTitle =
		contextualColorMeta !== null
			? sprintf(
					/* translators: %s: CSS color keyword (e.g. currentColor). */
					__(
						'Contextual color keyword: %s (no fixed preview).',
						'blockera'
					),
					value.trim()
				)
			: undefined;

	return (
		<span
			{...props}
			style={{ ...customStyle, ...style }}
			className={componentClassNames(
				'color-indicator',
				styleClassName,
				className
			)}
			title={contextualTitle !== undefined ? contextualTitle : title}
			aria-label={
				contextualTitle !== undefined ? contextualTitle : ariaLabel
			}
		>
			{contextualColorMeta !== null ? (
				<span
					className="blockera-component-color-indicator__keyword-badge"
					aria-hidden="true"
				>
					{contextualColorMeta.abbrev}
				</span>
			) : null}
			{children}
		</span>
	);
}
