// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import { type MixedElement, type ComponentType } from 'react';
import { Fill } from '@wordpress/components';
import { ErrorBoundary } from 'react-error-boundary';
import { useState, useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { omitWithPattern } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { StylesWrapper } from '../../style-engine';
import { sanitizeDefaultAttributes } from '../hooks/utils';
import { ErrorBoundaryFallback } from '../hooks/block-settings';
import { prepareBlockeraDefaultAttributesValues } from './utils';
import { BlockStyle } from '../../style-engine/components/block-style';

export const GlobalStylesRenderer: ComponentType<any> = (
	blockType: Object
): MixedElement => {
	const {
		name,
		supports,
		selectors,
		styleVariationName,
		renderInPortal = true,
		isStyleVariation = false,
		blockeraBlockTypeGlobalStyles,
		attributes: defaultAttributes,
	} = blockType;
	const [notice, setNotice] = useState(null);
	const [isReportingErrorCompleted, setIsReportingErrorCompleted] =
		useState(false);
	const defaultStyles = useMemo(() => {
		const processedAttributes: {
			[key: string]: { type: string, default: any },
		} = {};

		// Process each attribute to ensure it has both type and default
		for (const [key, attr] of Object.entries(defaultAttributes)) {
			processedAttributes[key] = {
				type: attr.type,
				default:
					attr.default !== undefined
						? attr.default
						: (() => {
								// Set default based on type if not provided
								switch (attr.type) {
									case 'string':
										return '';
									case 'boolean':
										return false;
									case 'number':
										return 0;
									case 'array':
										return [];
									case 'object':
										return {};
									default:
										return null;
								}
						  })(),
			};
		}

		return omitWithPattern(
			sanitizeDefaultAttributes(processedAttributes, {
				defaultWithoutValue: true,
			}),
			/!^blockera/
		);
	}, [defaultAttributes]);

	const { getDeviceType } = select('blockera/editor');

	const currentAttributes = {
		...prepareBlockeraDefaultAttributesValues(defaultStyles),
		...blockeraBlockTypeGlobalStyles,
	};

	const blockStyleProps = {
		supports,
		selectors,
		customCss: '',
		additional: {},
		blockName: name,
		isStyleVariation,
		inlineStyles: [],
		styleVariationName,
		isGlobalStylesWrapper: true,
		defaultAttributes: defaultStyles,
		clientId: name.replace('/', '-'),
		activeDeviceType: getDeviceType(),
		attributes: currentAttributes,
		currentAttributes,
	};

	if (
		!defaultAttributes.hasOwnProperty('blockeraPropsId') ||
		!Object.keys(blockeraBlockTypeGlobalStyles).length
	) {
		return <></>;
	}

	return (
		<ErrorBoundary
			fallbackRender={({ error }): MixedElement => (
				<ErrorBoundaryFallback
					{...{
						error,
						notice,
						setNotice,
						from: 'style-wrapper',
						props: blockStyleProps,
						isReportingErrorCompleted,
						setIsReportingErrorCompleted,
						fallbackComponent: BlockStyle,
						clientId: name.replace('/', '-'),
					}}
				/>
			)}
		>
			{renderInPortal ? (
				<StylesWrapper clientId={name} isGlobalStylesWrapper={true}>
					<Fill name={'blockera-global-styles-wrapper-' + name}>
						<BlockStyle {...blockStyleProps} />
					</Fill>
				</StylesWrapper>
			) : (
				<BlockStyle {...blockStyleProps} />
			)}
		</ErrorBoundary>
	);
};
