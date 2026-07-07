// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import { Button } from '../../../libs';
import { Icon } from '@blockera/icons';
import { controlInnerClassNames } from '@blockera/classnames';
import {
	useVarPickerCustomAddContext,
	type VarPickerCustomAddAction,
} from './var-picker-custom-add-context';

export function VarPickerCustomAddButton({
	customAddAction,
	dataTest,
}: {
	customAddAction: VarPickerCustomAddAction,
	dataTest: string,
}): MixedElement | null {
	if (customAddAction === null || customAddAction.canAdd !== true) {
		return null;
	}

	return (
		<Button
			tabIndex="-1"
			size={'extra-small'}
			data-test={dataTest}
			onClick={() => {
				customAddAction.onClick();
			}}
			style={{ padding: '5px' }}
			showTooltip={true}
			tooltipPosition="top"
			label={customAddAction.label}
			disabled={customAddAction.disabled === true}
			className={controlInnerClassNames('btn-add')}
		>
			<Icon icon="plus" iconSize="20" />
		</Button>
	);
}

export function VarPickerSectionCustomAddButton({
	variableType,
}: {
	variableType: string,
}): MixedElement | null {
	const customAddCtx = useVarPickerCustomAddContext();
	const typeKey = String(variableType || '').trim();
	const customAddAction =
		(typeKey !== '' && customAddCtx?.actionsByType?.[typeKey]) || null;

	return (
		<VarPickerCustomAddButton
			customAddAction={customAddAction}
			dataTest={`variable-picker-section-add-${variableType}`}
		/>
	);
}
