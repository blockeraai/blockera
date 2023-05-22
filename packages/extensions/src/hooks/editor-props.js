/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element';
import { createHigherOrderComponent } from '@wordpress/compose';
/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import { enhance } from './utils';
import { useBlockExtensions } from './hooks';
import deprecateAllFeatures from './deprecated';
import { isArray, isObject } from 'lodash';

/**
 * React hook function to override the default block element to add wrapper props.
 *
 * @function addEditorBlockAttributes
 * @param {Object} BlockListBlock Block and its wrapper in the editor.
 * @return {Object} BlockListBlock extended
 */
const withEditorProps = createHigherOrderComponent((BlockListBlock) => {
	return enhance(({ select, ...props }) => {
		const { currentExtension } = useBlockExtensions(props?.name);

		if (!currentExtension) {
			return <BlockListBlock {...props} />;
		}

		/**
		 * Block deprecation logic belongs here.
		 *
		 * By keeping this logic as an extension it allows us to remove a great deal of superfluous code.
		 * These deprecations would otherwise need to be applied on each respective block in the edit.js function.
		 */
		useEffect(() => deprecateAllFeatures(props), [props]);

		/**
		 * Group extensions in an array to minimize code duplication and
		 * allow a source of truth for all applied extensions.
		 */
		const { publisherEditorProps } = select('core/blocks').getBlockType(
			props?.name
		);

		if (!publisherEditorProps) {
			return <BlockListBlock {...props} />;
		}

		/**
		 * Merge classes from all extensions.
		 */
		const mergeClasses = classnames(
			Object.fromEntries(
				Object.entries(publisherEditorProps)
					.map((extendedProps) =>
						'className' !== extendedProps[0] ? null : extendedProps
					)
					.filter((item) => null !== item)
			)?.className
		);

		/**
		 * @function mergeProps Merge props from all extensions.
		 * @return {Object} The merged props from all extensions
		 */
		const mergeProps = () => {
			let mergedProps = {};

			/**
			 * Be aware of overriding existing props with matching properties names when adding new extensions.
			 * Classes are a known collision point and must be merged separately.
			 */
			Object.entries(publisherEditorProps).forEach((extendedProps) => {
				if (isObject(extendedProps[1])) {
					mergedProps = {
						...mergedProps,
						[extendedProps[0]]: {
							...(mergedProps[extendedProps[0]] ?? {}),
							...extendedProps[1],
						},
					};
				} else if (isArray(extendedProps[1])) {
					mergedProps = {
						...mergedProps,
						[extendedProps[0]]: [
							...(mergedProps[extendedProps[0]] ?? []),
							...extendedProps[1],
						],
					};
				} else {
					mergedProps = {
						...mergedProps,
						[extendedProps[0]]: extendedProps[1],
					};
				}
			});

			// Classnames collide due to matching property names. We delete them here and merge them separately.
			delete mergedProps.className;
			return mergedProps;
		};

		/**
		 * Extended wrapperProps applied to BlockListBlock.
		 * wrapperProps would be element attributes in the DOM
		 * such as `[data-publisher-align-support: 1]` but should not contain the className.
		 */
		const wrapperProps = {
			...mergeProps(),
		};

		return (
			<BlockListBlock
				{...{ ...props, className: mergeClasses }}
				wrapperProps={wrapperProps}
			/>
		);
	});
}, 'withAllNeedsEditorProps');

export default withEditorProps;
