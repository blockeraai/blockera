// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { __experimentalDivider as Divider } from '@wordpress/components';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import {
	Flex,
	Grid,
	Popover,
	Button,
	ToggleControl,
	ControlContextProvider,
} from '@blockera/controls';
import { controlInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { RenameModal } from './rename-modal';

export const StyleItemMenu = ({
	counter,
	setCounter,
	cachedStyle,
	isOpenRenameModal,
	setIsOpenRenameModal,
	isOpenContextMenu,
	setIsOpenContextMenu,
	style,
	buttonText,
	handleOnRename,
	handleOnDuplicate,
	handleOnClearAllCustomizations,
	setCurrentBlockStyleVariation,
	handleOnEnable,
	handleOnDelete,
	isConfirmedChangeID,
	setIsConfirmedChangeID,
}: {
	counter: number,
	setCounter: (counter: number) => void,
	cachedStyle: Object,
	setCurrentBlockStyleVariation: (style: Object) => void,
	handleOnDuplicate: (style: Object) => void,
	handleOnClearAllCustomizations: (style: Object) => void,
	handleOnEnable: (value: boolean, style: Object) => void,
	handleOnDelete: (style: Object) => void,
	isOpenRenameModal: boolean,
	setIsOpenRenameModal: (isOpen: boolean) => void,
	isOpenContextMenu: boolean,
	setIsOpenContextMenu: (isOpen: boolean) => void,
	style: Object,
	buttonText: string,
	handleOnRename: (style: Object) => void,
	isConfirmedChangeID: boolean,
	setIsConfirmedChangeID: (isConfirmed: boolean) => void,
}): MixedElement => {
	return (
		<>
			{isOpenRenameModal && (
				<RenameModal
					style={style}
					buttonText={buttonText}
					handleOnRename={handleOnRename}
					isConfirmedChangeID={isConfirmedChangeID}
					setIsOpenRenameModal={setIsOpenRenameModal}
					setIsConfirmedChangeID={setIsConfirmedChangeID}
				/>
			)}

			{isOpenContextMenu && (
				<Popover
					title={''}
					offset={50}
					draggable={true}
					placement="left-start"
					className="variations-settings-popover"
					onClose={() => {
						setIsOpenContextMenu(false);
					}}
				>
					<Flex direction="column" gap={2}>
						<Button
							variant="link"
							contentAlign="left"
							className={controlInnerClassNames('menu-item')}
							onClick={() => handleOnDuplicate(style)}
						>
							<Icon icon="duplicate" iconSize="24" />
							{__('Duplicate', 'blockera')}
						</Button>

						<Button
							variant="link"
							contentAlign="left"
							className={controlInnerClassNames('menu-item')}
							onClick={() =>
								handleOnClearAllCustomizations(style)
							}
						>
							<Icon icon="undo" iconSize="24" />
							{__('Clear all customizations', 'blockera')}
						</Button>

						<Button
							variant="link"
							contentAlign="left"
							className={controlInnerClassNames('menu-item')}
							onClick={() => {
								setCurrentBlockStyleVariation(style);

								if (isOpenRenameModal) {
									return setIsOpenRenameModal(false);
								}

								setIsOpenRenameModal(true);
							}}
						>
							<Icon icon="pen" iconSize="24" />
							{__('Rename', 'blockera')}
						</Button>

						<Grid
							gridTemplateColumns="24px 1fr"
							gap={8}
							alignItems="center"
							style={{
								padding: '0 6px',
								height: '28px',
								'font-size': '11px',
								color: '#7A7A7A',
								background: '#f6f6f6',
								'align-items': 'center',
								'border-radius': '2px',
								margin: '6px 0 4px',
								'font-family': 'Consolas, Monaco, monospace',
								'unicode-bidi': 'embed',
							}}
						>
							<span
								style={{
									'text-align': 'center',
								}}
							>
								ID:
							</span>
							{style.name}
						</Grid>

						{!style.isDefault && (
							<Divider
								style={{
									color: '#e6e6e6',
									margin: '12px -16px 8px',
								}}
							/>
						)}

						{!style?.isDefault && (
							<Grid
								gridTemplateColumns="24px 1fr"
								gap={8}
								alignItems="center"
								style={{
									padding: '0 6px',
									height: '36px',
								}}
							>
								<ControlContextProvider
									value={{
										name: `${style.name}-toggle`,
										value:
											true === cachedStyle?.status ||
											!cachedStyle.hasOwnProperty(
												'status'
											),
									}}
								>
									<ToggleControl
										labelType={'self'}
										label={' '}
										onChange={(value: boolean): void =>
											handleOnEnable(value, style)
										}
										size="small"
									/>
								</ControlContextProvider>

								{false === cachedStyle?.status
									? __('Inactive Style', 'blockera')
									: __('Active Style', 'blockera')}
							</Grid>
						)}

						{!style.isDefault && (
							<Button
								variant="link"
								contentAlign="left"
								className={controlInnerClassNames('menu-item')}
								onClick={() => {
									handleOnDelete(style.name);
									setCounter(counter - 1);
								}}
								style={{
									'--blockera-controls-primary-color':
										'#E20000',
								}}
							>
								<Icon icon="trash" iconSize="24" />
								{__('Delete', 'blockera')}
							</Button>
						)}
					</Flex>
				</Popover>
			)}
		</>
	);
};
