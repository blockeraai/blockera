/**
 * External dependencies
 */
import { BlockControls, InspectorControls } from '@wordpress/block-editor';
import { useEffect, useRef, useMemo } from '@wordpress/element';
import { createHigherOrderComponent } from '@wordpress/compose';
import { select } from '@wordpress/data';

/**
 * Publisher dependencies
 */
import { isFunction } from '@publisher/utils';
import { computedCssRules } from '@publisher/style-engine';
import { extensionClassNames } from '@publisher/classnames';
import { Divider } from '@publisher/components';

/**
 * Internal dependencies
 */
import { useAttributes } from './utils';
import { useBlockExtensions, useDisplayBlockControls } from './hooks';
import { PanelBodyControl } from '@publisher/controls';

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
					<InspectorControls key={`${name}-${index}`}>
						<PanelBodyControl title={label} initialOpen={isOpen}>
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
						</PanelBodyControl>
					</InspectorControls>
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
			if (!isFunction(sideEffect)) {
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

							{isFunction(Edit) && (
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
