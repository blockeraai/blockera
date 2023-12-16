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
import { Button, Popover } from '@publisher/components';
import { BaseControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import type { ValueAddonControlProps } from '../control/types';
import { getDynamicValueIcon, isValid } from '../../helpers';
import TrashIcon from '../../icons/trash';
import SearchIcon from '../../icons/search';
import CaretRightIcon from '../../icons/caret-right';
import GearIcon from '../../icons/gear';
import { getDynamicValue } from '@publisher/core-data';
import { isUndefined } from '@publisher/utils';

export default function ({
	controlProps,
}: {
	controlProps: ValueAddonControlProps,
}): Element<any> {
	const item = getDynamicValue(
		controlProps.value.settings.category,
		controlProps.value.id
	);

	return (
		<Popover
			title={__('Dynamic Value Setting', 'publisher-core')}
			offset={125}
			placement="left-start"
			onClose={() => {
				controlProps.setOpen('');
			}}
			className={controlInnerClassNames('popover-dynamic-values')}
			titleButtonsRight={
				<>
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
			<BaseControl
				label={__('Type', 'publisher-core')}
				columns="columns-2"
			>
				<Button
					size="input"
					contentAlign="left"
					onClick={() => {
						controlProps.setOpen('dv-picker');
					}}
					label={__('Change Dynamic Value', 'publisher-core')}
					showTooltip={true}
				>
					{getDynamicValueIcon(controlProps.value?.settings?.type)}
					{!isUndefined(item?.name) ? item.name : ''}
					<SearchIcon style={{ marginLeft: 'auto' }} />
				</Button>
			</BaseControl>

			<BaseControl
				label={__('Advanced', 'publisher-core')}
				columns="columns-2"
			>
				<Button
					size="input"
					contentAlign="left"
					onClick={() => {
						controlProps.setOpen('dv-settings-advanced');
					}}
					label={__(
						'Advanced Customization Options',
						'publisher-core'
					)}
					showTooltip={true}
				>
					<GearIcon />
					{__('Customize', 'publisher-core')}
					<CaretRightIcon style={{ marginLeft: 'auto' }} />
				</Button>
			</BaseControl>
		</Popover>
	);
}
