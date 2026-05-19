// @flow

/**
 * External dependencies
 */
import { useSelect } from '@wordpress/data';
import { type MixedElement, type ComponentType } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { memo, useState, useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { omitWithPattern, isEquals } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { StylesWrapper } from '../../style-engine';
import { sanitizeDefaultAttributes } from '../hooks/utils';
import { ErrorBoundaryFallback } from '../hooks/block-settings';
import { prepareBlockeraDefaultAttributesValues } from './utils';
import { BlockStyle } from '../../style-engine/components/block-style';

export const GlobalStylesRenderer: ComponentType<any> = memo(
	(blockType: Object): MixedElement => {
		const {
			name,
			supports,
			selectors,
			styleVariationName,
			renderInPortal = true,
			isStyleVariation = false,
			sanitizedBlockGlobalStyles,
			attributes: defaultAttributes,
			variationClassPrefix = 'is-style-',
		} = blockType;
		const [notice, setNotice] = useState(null);
		const [isReportingErrorCompleted, setIsReportingErrorCompleted] =
			useState(false);

		// Memoize default styles processing
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

		// Use useSelect hook instead of direct select() to prevent re-renders
		const activeDeviceType = useSelect((select) => {
			const { getDeviceType } = select('blockera/editor');
			return getDeviceType();
		}, []);

		// Memoize client ID to avoid repeated string operations
		const clientId = useMemo(() => name.replace('/', '-'), [name]);

		// Memoize prepared default attributes values
		const preparedDefaultValues = useMemo(
			() => prepareBlockeraDefaultAttributesValues(defaultStyles),
			[defaultStyles]
		);

		// Memoize current attributes to prevent unnecessary re-renders
		const currentAttributes = useMemo(
			() => ({
				...preparedDefaultValues,
				...sanitizedBlockGlobalStyles,
			}),
			[preparedDefaultValues, sanitizedBlockGlobalStyles]
		);

		// Memoize block style props to prevent unnecessary re-renders
		const blockStyleProps = useMemo(
			() => ({
				supports,
				selectors,
				customCss: '',
				additional: {},
				blockName: name,
				isStyleVariation,
				inlineStyles: [],
				styleVariationName,
				variationClassPrefix,
				isGlobalStylesWrapper: true,
				defaultAttributes: defaultStyles,
				clientId,
				activeDeviceType,
				attributes: currentAttributes,
				currentAttributes,
			}),
			[
				supports,
				selectors,
				name,
				isStyleVariation,
				styleVariationName,
				variationClassPrefix,
				defaultStyles,
				clientId,
				activeDeviceType,
				currentAttributes,
			]
		);

		// Early return if no styles to render
		const hasBlockeraPropsId =
			defaultAttributes.hasOwnProperty('blockeraPropsId');
		const hasSanitizedStyles =
			sanitizedBlockGlobalStyles &&
			Object.keys(sanitizedBlockGlobalStyles).length > 0;

		if (!hasBlockeraPropsId || !hasSanitizedStyles) {
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
							clientId,
						}}
					/>
				)}
			>
				{renderInPortal ? (
					<StylesWrapper isGlobalStylesWrapper={true}>
						<BlockStyle {...blockStyleProps} />
					</StylesWrapper>
				) : (
					<BlockStyle {...blockStyleProps} />
				)}
			</ErrorBoundary>
		);
	},
	(prevProps, nextProps) => {
		// Custom comparison function to prevent unnecessary re-renders
		return (
			prevProps.name === nextProps.name &&
			prevProps.styleVariationName === nextProps.styleVariationName &&
			prevProps.variationClassPrefix === nextProps.variationClassPrefix &&
			prevProps.isStyleVariation === nextProps.isStyleVariation &&
			// prevProps.renderInPortal === nextProps.renderInPortal &&
			isEquals(
				prevProps.sanitizedBlockGlobalStyles,
				nextProps.sanitizedBlockGlobalStyles
			) &&
			isEquals(prevProps.supports, nextProps.supports) &&
			isEquals(prevProps.selectors, nextProps.selectors) &&
			isEquals(prevProps.attributes, nextProps.attributes)
		);
	}
);
