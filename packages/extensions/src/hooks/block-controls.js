/**
 * WordPress dependencies
 */
import { BlockControls } from '@wordpress/block-editor';
import { useEffect, useRef, useMemo } from '@wordpress/element';
import { createHigherOrderComponent } from '@wordpress/compose';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { computedCssRules } from '@publisher/style-engine';
import { extensionClassNames } from '@publisher/classnames';
import { useBlockExtensions, useDisplayBlockControls } from './hooks';
import { Divider, InspectElement } from '@publisher/components';

/**
 * Add custom Publisher props identifier to selected blocks
 *
 * @param {Object} props Block props
 * @return {{}|Object} Block props extended with Publisher Extensions.
 */
const useAttributes = (props: Object): Object => {
	const extendedProps = { ...props };

	if (typeof extendedProps.attributes.publisherPropsId === 'undefined') {
		const d = new Date();
		extendedProps.attributes.publisherPropsId =
			'' +
			d.getMonth() +
			d.getDate() +
			d.getHours() +
			d.getMinutes() +
			d.getSeconds() +
			d.getMilliseconds();
	}

	return extendedProps;
};

const MappedControlsExtensions = (props) => {
	const { publisherEdit } = select('core/blocks').getBlockType(props?.name);

	//Mapped controls `Edit` component to rendering in WordPress current Block Type!
	const {
		BlockUI: { Edit: BlockEditComponent },
		ExtensionUI,
		FieldUI,
	} = publisherEdit;

	return (
		<BlockEditComponent {...props}>
			{ExtensionUI.map(
				(
					{ name, label, isOpen, Edit: ExtensionEditComponent },
					index
				) => (
					<InspectElement
						title={label}
						initialOpen={isOpen}
						key={`${name}-${index}`}
					>
						<ExtensionEditComponent {...props}>
							{FieldUI.map((field, fieldId) => {
								if (!field[name]) {
									return null;
								}

								const FieldEditComponent = field[name];

								return (
									<>
										<FieldEditComponent
											key={`${name}-${index}-${fieldId}`}
											{...props}
										/>
										<Divider />
									</>
								);
							})}
						</ExtensionEditComponent>
					</InspectElement>
				)
			)}
		</BlockEditComponent>
	);
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
		const { blockType, currentExtension } = useBlockExtensions(name);

		if (!currentExtension) {
			return <BlockEdit {...blockProps} />;
		}

		//Extended Block Properties with publisherPropsId when changes blockProps!
		const props = useMemo(() => {
			return {
				...useAttributes(blockProps),
			};
		}, [blockProps]);

		const classnames = extensionClassNames({
			[props.className]: true,
			[`publisher-client-id-${props.clientId}`]: true,
		});

		const blockEditRef = useRef();
		const { Edit, sideEffect } = currentExtension;
		const __cssRules = computedCssRules(blockType, props);

		useEffect(() => {
			if ('function' !== typeof sideEffect) {
				return;
			}

			sideEffect(blockEditRef, props);
		}, [blockEditRef, props, sideEffect]);

		return (
			<>
				<BlockControls group="block" __experimentalShareWithChildBlocks>
					{useDisplayBlockControls() && (
						<>
							<MappedControlsExtensions {...props} />
							{'function' === typeof Edit && (
								<Edit {...{ ...props, name }} />
							)}
						</>
					)}
				</BlockControls>
				<BlockEdit {...props} className={classnames} />
				{0 !== __cssRules?.length && (
					<style
						dangerouslySetInnerHTML={{
							__html: __cssRules,
						}}
					/>
				)}
			</>
		);
	};
}, 'withAllNeedsControls');

export default withBlockControls;
