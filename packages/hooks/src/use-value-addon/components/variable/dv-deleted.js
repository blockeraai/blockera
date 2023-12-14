// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { controlInnerClassNames } from '@publisher/classnames';
import { isUndefined } from '@publisher/utils';
import { Button, Flex, Popover } from '@publisher/components';

/**
 * Internal dependencies
 */
import type { ValueAddonControlProps } from '../control/types';
import { canUnlinkVariable, isValid } from '../../helpers';
import UnlinkIcon from '../../icons/unlink';
import TrashIcon from '../../icons/trash';

export default function ({
	controlProps,
}: {
	controlProps: ValueAddonControlProps,
}): Element<any> {
	const valueAvailable =
		!isUndefined(controlProps.value?.settings?.value) &&
		controlProps.value?.settings?.value !== '';

	let label =
		!isUndefined(controlProps.value?.settings?.name) &&
		controlProps.value?.settings?.name !== '' &&
		controlProps.value?.settings?.name;

	if (label) {
		label = controlProps.value?.settings?.slug;
	}

	return (
		<Popover
			title={__('Deleted Variable', 'publisher-core')}
			offset={125}
			placement="left-start"
			onClose={() => controlProps.setOpen('')}
			className={controlInnerClassNames('popover-variable-deleted')}
			titleButtonsRight={
				<>
					{canUnlinkVariable(controlProps.value) && (
						<Button
							tabIndex="-1"
							size={'extra-small'}
							onClick={controlProps.handleOnUnlinkVar}
							style={{ padding: '5px' }}
							label={__(
								'Unlink Variable Value',
								'publisher-core'
							)}
						>
							<UnlinkIcon />
						</Button>
					)}

					{isValid(controlProps.value) && (
						<Button
							tabIndex="-1"
							size={'extra-small'}
							onClick={controlProps.handleOnClickRemove}
							style={{ padding: '5px' }}
							label={__('Remove', 'publisher-core')}
						>
							<TrashIcon />
						</Button>
					)}
				</>
			}
		>
			{valueAvailable ? (
				<Flex direction="column" gap={15}>
					<p style={{ fontSize: '12px', margin: 0 }}>
						{__(
							"There was a deletion or disappearance of this variable, however it's value is still used here.",
							'publisher-core'
						)}
					</p>
					<p style={{ fontSize: '12px', margin: 0 }}>
						{__('Variable:', 'publisher-core')}{' '}
						<b
							style={{
								color: 'var(--publisher-value-addon-var-deleted-color)',
							}}
						>
							{label}
						</b>
					</p>
					<p style={{ fontSize: '12px', margin: 0 }}>
						{__(
							'It is possible to restore this variable or unlink it in order to change its value.',
							'publisher-core'
						)}
					</p>
					<Flex
						direction="row-reverse"
						gap={8}
						style={{ marginTop: '25px' }}
					>
						<Button
							variant="primary"
							tabIndex="-1"
							size={'small'}
							onClick={controlProps.handleOnUnlinkVar}
							label={__(
								'Unlink Variable Value',
								'publisher-core'
							)}
							style={{ padding: '2px 8px' }}
						>
							<UnlinkIcon />
							{__('Unlink Variable', 'publisher-core')}
						</Button>
						<Button
							variant="tertiary"
							tabIndex="-1"
							size={'small'}
							onClick={() => {
								controlProps.setOpen('var');
							}}
							label={__(
								'Switch To Another Variable',
								'publisher-core'
							)}
							style={{
								padding: '2px 8px',
								marginRight: 'auto',
							}}
						>
							{__('Switch Variable', 'publisher-core')}
						</Button>
					</Flex>
				</Flex>
			) : (
				<Flex direction="column" gap={15}>
					<p style={{ fontSize: '12px', margin: 0 }}>
						{__(
							'There was a deletion or disappearance of the this variable and the value is not available.',
							'publisher-core'
						)}
					</p>
					<p style={{ fontSize: '12px', margin: 0 }}>
						{__('Variable:', 'publisher-core')}{' '}
						<b
							style={{
								color: 'var(--publisher-value-addon-var-deleted-color)',
							}}
						>
							{label}
						</b>
					</p>
					<p style={{ fontSize: '12px', margin: 0 }}>
						{__(
							'It is possible to switch this variable or remove it.',
							'publisher-core'
						)}
					</p>
					<Flex
						direction="row-reverse"
						gap={8}
						style={{ marginTop: '25px' }}
					>
						<Button
							variant="primary"
							tabIndex="-1"
							size={'small'}
							onClick={controlProps.handleOnClickRemove}
							label={__(
								'Remove Variable Usage',
								'publisher-core'
							)}
							style={{ padding: '2px 8px' }}
						>
							<TrashIcon />
							{__('Remove', 'publisher-core')}
						</Button>
						<Button
							variant="tertiary"
							tabIndex="-1"
							size={'small'}
							onClick={() => {
								controlProps.setOpen('var');
							}}
							label={__(
								'Switch To Another Variable',
								'publisher-core'
							)}
							style={{
								padding: '2px 8px',
								marginRight: 'auto',
							}}
						>
							{__('Switch Variable', 'publisher-core')}
						</Button>
					</Flex>
				</Flex>
			)}
		</Popover>
	);
}
