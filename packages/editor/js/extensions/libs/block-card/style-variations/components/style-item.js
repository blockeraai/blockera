// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { dispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import {
	__experimentalTruncate as Truncate,
	__experimentalDivider as Divider,
} from '@wordpress/components';
import { useGlobalStylesPanelContext } from '../../../../../canvas-editor/components/block-global-styles-panel-screen/context';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { Flex, Button, Popover } from '@blockera/controls';
import { classNames, controlInnerClassNames } from '@blockera/classnames';

export const StyleItem = ({
	style,
	activeStyle,
	styleItemHandler,
	onSelectStylePreview,
	setCurrentPreviewStyle,
	inGlobalStylesPanel = false,
}: {
	style: Object,
	activeStyle: Object,
	inGlobalStylesPanel: boolean,
	styleItemHandler: (style: Object) => void,
	onSelectStylePreview: (style: Object) => void,
	setCurrentPreviewStyle: (style: Object) => void,
}): MixedElement => {
	const { setCurrentBlockStyleVariation } = useGlobalStylesPanelContext() || {
		setCurrentBlockStyleVariation: () => {},
	};
	const buttonText = style.label || style.name || __('Default', 'blockera');
	const [isOpenContextMenu, setIsOpenContextMenu] = useState(false);

	const handleOnDuplicate = (currentStyle) => {
		console.log(currentStyle);
	};

	const handleOnClearAllCustomizations = (currentStyle) => {
		console.log(currentStyle);
	};

	const handleOnEnable = (status) => {
		console.log(status);
	};

	const handleOnDelete = (currentStyleName) => {
		console.log(currentStyleName);
	};

	return (
		<>
			<Button
				className={classNames('block-editor-block-styles__item', {
					'is-active': activeStyle.name === style.name,
				})}
				key={style.name}
				variant="secondary"
				label={
					style?.isDefault && style?.name !== 'default'
						? buttonText + ` (${__('Default', 'blockera')})`
						: ''
				}
				onMouseEnter={() => {
					if (inGlobalStylesPanel) {
						return;
					}

					styleItemHandler(style);
				}}
				onFocus={() => {
					if (inGlobalStylesPanel) {
						return;
					}

					styleItemHandler(style);
				}}
				onMouseLeave={() => {
					if (inGlobalStylesPanel) {
						return;
					}

					styleItemHandler(null);
				}}
				onBlur={() => {
					if (inGlobalStylesPanel) {
						return;
					}

					setCurrentPreviewStyle(null);
					styleItemHandler(null);
				}}
				onClick={() => {
					if (inGlobalStylesPanel) {
						// Navigate to the block style variation customization panel when clicked in global styles context.

						const { setSelectedBlockStyleVariation } =
							dispatch('blockera/editor');

						setSelectedBlockStyleVariation(style);
						return setCurrentBlockStyleVariation(style);
					}

					onSelectStylePreview(style);
				}}
				aria-current={activeStyle.name === style.name}
				size="input"
				data-test={`style-${style.name}`}
			>
				<Truncate
					numberOfLines={1}
					className="block-editor-block-styles__item-text"
				>
					<Flex
						justifyContent={'space-between'}
						alignItems={'center'}
					>
						{buttonText}
						<Flex gap={2}>
							{!(style?.isEnabled || true) && (
								<Icon icon="eye-hide" iconSize="20" />
							)}
							<Icon
								icon="more-vertical"
								iconSize="20"
								onClick={() => {
									setIsOpenContextMenu(true);
								}}
							/>
						</Flex>
					</Flex>
				</Truncate>
			</Button>

			{isOpenContextMenu && (
				<Popover
					title={''}
					offset={10}
					placement="bottom-start"
					className="variations-picker-popover"
					onClose={() => {
						setIsOpenContextMenu(false);
					}}
				>
					<Flex direction="column" gap={10}>
						<Flex
							justifyContent={'flex-start'}
							gap={8}
							alignItems={'center'}
							className={controlInnerClassNames('menu-item')}
							onClick={() => handleOnDuplicate(style)}
						>
							<Icon icon="duplicate" iconSize="24" />
							{__('Duplicate', 'blockera')}
						</Flex>
						<Flex
							justifyContent={'flex-start'}
							gap={8}
							alignItems={'center'}
							className={controlInnerClassNames('menu-item')}
							onClick={() =>
								handleOnClearAllCustomizations(style)
							}
						>
							<Icon icon="icon-circle-arrow-left" iconSize="24" />
							{__('Clear all customizations', 'blockera')}
						</Flex>
						<Divider />
						<Flex
							justifyContent={'flex-start'}
							gap={8}
							alignItems={'center'}
							className={controlInnerClassNames('menu-item')}
							onClick={() => handleOnEnable(true)}
						>
							<Icon icon="eye-show" iconSize="24" />
							{__('Enable', 'blockera')}
						</Flex>
						<Flex
							justifyContent={'flex-start'}
							gap={8}
							alignItems={'center'}
							className={controlInnerClassNames('menu-item', {
								'is-disabled': !style?.isEnabled || false,
							})}
							onClick={() => handleOnEnable(false)}
						>
							<Icon icon="eye-hide" iconSize="24" />
							{__('Disable', 'blockera')}
						</Flex>
						<Flex
							justifyContent={'flex-start'}
							gap={8}
							alignItems={'center'}
							className={controlInnerClassNames('menu-item', {
								'delete-style': true,
							})}
							onClick={() => handleOnDelete(style.name)}
						>
							<Icon icon="icon-recycle-bin" iconSize="24" />
							{__('Delete', 'blockera')}
						</Flex>
					</Flex>
				</Popover>
			)}
		</>
	);
};
