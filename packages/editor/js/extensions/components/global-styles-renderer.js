// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import { type MixedElement } from 'react';
import { Fill } from '@wordpress/components';
import { ErrorBoundary } from 'react-error-boundary';
import { memo, useState, useMemo, useEffect } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { isEquals, cloneObject, omitWithPattern } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { StylesWrapper } from '../../style-engine';
import {
	sanitizeBlockAttributes,
	sanitizeDefaultAttributes,
} from '../hooks/utils';
import { ErrorBoundaryFallback } from '../hooks/block-settings';
import { prepareBlockeraDefaultAttributesValues } from './utils';
import { BlockStyle } from '../../style-engine/components/block-style';
import { useGlobalStylesContext } from '../../canvas-editor/components/block-global-styles-panel-screen/global-styles-provider';

export const GlobalStylesRenderer: ComponentType<any> = memo(
	(blockType: Object): MixedElement => {
		const {
			name,
			supports,
			selectors,
			attributes: defaultAttributes,
		} = blockType;
		const [attributes, setAttributes] = useState({});
		const [notice, setNotice] = useState(null);
		const [isReportingErrorCompleted, setIsReportingErrorCompleted] =
			useState(false);
		const sanitizedAttributes = useMemo(
			() => sanitizeBlockAttributes(cloneObject(attributes)),
			[attributes]
		);
		const defaultStyles = useMemo(() => {
			const processedAttributes = {};

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

		const {
			merged: mergedConfig,
			// base: baseConfig,
			// user: userConfig,
			// setUserConfig,
		} = useGlobalStylesContext();
		let {
			styles: {
				blocks: { [name]: initialBlockGlobalStyles },
			},
		} = mergedConfig;

		initialBlockGlobalStyles = {
			...prepareBlockeraDefaultAttributesValues(defaultStyles),
			...initialBlockGlobalStyles,
			blockeraBlockStates: {
				value: {
					...(initialBlockGlobalStyles?.blockeraBlockStates?.value ||
						{}),
					normal: {
						breakpoints: {},
						isVisible: true,
					},
				},
			},
			blockeraPropsId: encodeURIComponent(name),
		};

		const { getDeviceType } = select('blockera/editor');

		const blockStyleProps = {
			supports,
			selectors,
			customCss: '',
			additional: {},
			inlineStyles: [],
			blockName: name,
			isGlobalStylesWrapper: true,
			defaultAttributes: defaultStyles,
			attributes: sanitizedAttributes,
			clientId: name.replace('/', '-'),
			activeDeviceType: getDeviceType(),
		};

		// Based on the merged config changeset, we should update the state of our component.
		useEffect(() => {
			if (isEquals(initialBlockGlobalStyles, attributes)) {
				return;
			}

			setAttributes(initialBlockGlobalStyles);
		}, [initialBlockGlobalStyles, attributes]);

		if (
			!defaultAttributes.hasOwnProperty('blockeraPropsId') ||
			!Object.keys(sanitizedAttributes).length
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
				<StylesWrapper clientId={name} isGlobalStylesWrapper={true}>
					<Fill name={'blockera-global-styles-wrapper-' + name}>
						<BlockStyle {...blockStyleProps} />
					</Fill>
				</StylesWrapper>
			</ErrorBoundary>
		);
	}
);
