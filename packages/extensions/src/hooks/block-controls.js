/**
 * WordPress dependencies
 */
import { getBlockSupport } from '@wordpress/blocks';
import { select } from '@wordpress/data';
import { useEffect, useRef, useMemo } from '@wordpress/element';
import { createHigherOrderComponent } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import controlsExtensions from './controls';
import { STORE_NAME } from '../store/constants';
import { extensionClassNames } from '@publisher/classnames';
import { CssGenerators } from '../api/css-generator';

/**
 * Add custom Publisher Extensions attributes to selected blocks
 *
 * @param {Object} props Block props
 * @return {{}|Object} Block props extended with Publisher Extensions attributes.
 */
const useAttributes = (props: Object): Object => {
	const extendedProps = { ...props };

	extendedProps.attributes.publisherAttributes =
		extendedProps.attributes.publisherAttributes || {};

	if (
		typeof extendedProps.attributes.publisherAttributes.id === 'undefined'
	) {
		const d = new Date();
		extendedProps.attributes.publisherAttributes = Object.assign(
			{},
			extendedProps.attributes.publisherAttributes,
			{
				id:
					'' +
					d.getMonth() +
					d.getDate() +
					d.getHours() +
					d.getMinutes() +
					d.getSeconds() +
					d.getMilliseconds(),
			}
		);
	}

	return extendedProps;
};

const MappedControlsExtensions = (props: Object): Array<Object> => {
	const mappedItems = [];

	const blockSupport = getBlockSupport(
		props.name,
		'__experimentalPublisherDefaultControls'
	);

	//Mapped controls `Edit` component to rendering in WordPress current Block Type!
	Object.keys(controlsExtensions).forEach((support, index) => {
		if (blockSupport[support]) {
			const { Edit } = controlsExtensions[support];

			if ('function' !== typeof Edit) {
				return;
			}

			mappedItems.push(<Edit key={`${support}-${index}`} {...props} />);
		}
	});

	return mappedItems;
};

/**
 * Retrieve css
 *
 * @param {Object} blockType The current block type
 * @param {*} blockProps The current block properties
 * @returns {string} The current block css output of css generators!
 */
export const getCss = (blockType: Object, blockProps: Object): string => {
	let css = '';
	const { publisherCssGenerators } = blockType;

	for (const controlId in publisherCssGenerators) {
		if (!Object.hasOwnProperty.call(publisherCssGenerators, controlId)) {
			continue;
		}

		const generator = publisherCssGenerators[controlId];

		if (!generator?.type) {
			continue;
		}

		const cssGenerator = new CssGenerators(
			controlId,
			generator,
			blockProps
		);

		css += cssGenerator.rules() + '\n';
	}

	return css;
};

/**
 * Add custom publisher extensions controls to selected blocks
 *
 * @param {Function} BlockEdit Original component.
 * @return {string} Wrapped component.
 */
const withBlockControls = createHigherOrderComponent((BlockEdit) => {
	return (blockProps) => {
		const { name } = blockProps;
		const registeredBlockExtension =
			select(STORE_NAME).getBlockExtension(name);

		if (!registeredBlockExtension) {
			return <BlockEdit {...blockProps} />;
		}

		const blockType = select('core/blocks').getBlockType(name);

		const props = useMemo(() => {
			return {
				...useAttributes(blockProps),
			};
		}, [blockProps]);

		const blockEditRef = useRef();
		const { Edit, sideEffect } = registeredBlockExtension;

		useEffect(() => {
			if ('function' !== typeof sideEffect) {
				return;
			}

			sideEffect(blockEditRef, props);
		}, [blockEditRef, props, sideEffect]);

		const __css = getCss(blockType, props);

		return (
			<>
				<BlockEdit
					{...props}
					className={extensionClassNames(
						'publisher-extension-ref',
						`client-id-${props.clientId}`,
						props.className
					)}
				/>
				<MappedControlsExtensions {...{ ...props, name }} />
				{'function' === typeof Edit && <Edit {...{ ...props, name }} />}
				{__css && (
					<style
						dangerouslySetInnerHTML={{
							__html: __css,
						}}
					/>
				)}
			</>
		);
	};
}, 'withAllNeedsControls');

export default withBlockControls;
