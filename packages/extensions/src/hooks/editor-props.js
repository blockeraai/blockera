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
import { useBlockExtensions, getExtendedProps } from './hooks';
import deprecateAllFeatures from './deprecated';

/**
 * React hook function to override the default block element to add wrapper props.
 *
 * @function addEditorBlockAttributes
 * @param {Object} BlockListBlock Block and its wrapper in the editor.
 * @return {Object} BlockListBlock extended
 */
const withEditorProps = createHigherOrderComponent((BlockListBlock) => {
	return enhance(({ select, ...props }) => {
		const { currentExtension, hasExtensionSupport, extensions } =
			useBlockExtensions(props?.name);

		if (!currentExtension) {
			return <BlockListBlock {...props} />;
		}

		// const blockEditorStore = 'core/block-editor';

		/**
		 * Block deprecation logic belongs here.
		 *
		 * By keeping this logic as an extension it allows us to remove a great deal of superfluous code.
		 * These deprecations would otherwise need to be applied on each respective block in the edit.js function.
		 */
		useEffect(() => deprecateAllFeatures(props), [props]);

		/**
		 * Some controls must use the parent blocks like for
		 * galleries but others will use children like buttonControls
		 */
		const parentBlock = select(blockEditorStore).getBlock(
			props.rootClientId || props.clientId
		);
		// const parentBlockName = select(blockEditorStore).getBlockName(
		// 	props.rootClientId || props.clientId
		// );
		// const childBlock = select(blockEditorStore).getBlock(props.clientId);
		// const childBlockName = select(blockEditorStore).getBlockName(
		// 	props.clientId
		// );

		/**
		 * Group extensions in an array to minimize code duplication and
		 * allow a source of truth for all applied extensions.
		 */
		const everyExtension = [];
		const { publisherEditorProps } = currentExtension;

		if (publisherEditorProps) {
			everyExtension.push(
				getExtendedProps(props.wrapperProps, publisherEditorProps)
			);
		}

		extensions.forEach((extension) => {
			if (!hasExtensionSupport(currentExtension, extension.name)) {
				return;
			}

			const { publisherEditorProps: editorProps } = extension;

			everyExtension.push(
				getExtendedProps(props.wrapperProps, editorProps)
			);
		});

		if (!everyExtension?.length) {
			return <BlockListBlock {...props} />;
		}

		/**
		 * Merge classes from all extensions.
		 */
		const mergeClasses = classnames(
			...everyExtension.map((extendedProps) => extendedProps?.className)
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
			everyExtension.forEach((extendedProps) => {
				mergedProps = {
					...mergedProps,
					...extendedProps,
				};
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
