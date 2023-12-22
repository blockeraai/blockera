// @flow
/**
 * External dependencies
 */
import { useState } from '@wordpress/element';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import type { BoxSpacingControlProps, Side } from './types';
import { BaseControl } from '../index';
import { useControlContext } from '../../context';
import { MarginAll } from './components/margin/margin-all';
import { MarginVertical } from './components/margin/margin-vertical';
import { MarginHorizontal } from './components/margin/margin-horizontal';
import { MarginTop } from './components/margin/margin-top';
import { MarginRight } from './components/margin/margin-right';
import { MarginLeft } from './components/margin/margin-left';
import { MarginBottom } from './components/margin/margin-bottom';
import { PaddingAll } from './components/padding/padding-all';
import { PaddingVertical } from './components/padding/padding-vertical';
import { PaddingTop } from './components/padding/padding-top';
import { PaddingBottom } from './components/padding/padding-bottom';
import { PaddingHorizontal } from './components/padding/padding-horizontal';
import { PaddingLeft } from './components/padding/padding-left';
import { PaddingRight } from './components/padding/padding-right';
import { Margin } from './components/margin/margin';
import { Padding } from './components/padding/padding';

export default function BoxSpacingControl({
	className,
	openSide = '',
	//
	id,
	label = '',
	columns = '',
	defaultValue = {
		margin: {
			top: '',
			right: '',
			bottom: '',
			left: '',
		},
		marginLock: 'vertical-horizontal',
		padding: {
			top: '',
			right: '',
			bottom: '',
			left: '',
		},
		paddingLock: 'vertical-horizontal',
	},
	onChange = () => {},
	field,
	marginDisable = 'none',
	paddingDisable = 'none',
	//
	...props
}: BoxSpacingControlProps): MixedElement {
	const {
		value,
		setValue,
		getId,
		attribute,
		blockName,
		description,
		resetToDefault,
		getControlPath,
	} = useControlContext({
		id,
		onChange,
		defaultValue,
		mergeInitialAndDefault: true,
	});

	const [openPopover, setOpenPopover]: [Side, (Side) => void] =
		useState(openSide);
	const [focusSide, setFocusSide]: [Side, (Side) => void] = useState('');
	const [controlClassName, setControlClassName]: [string, (string) => void] =
		useState('');

	const sideProps = {
		id,
		getId,
		//
		value,
		setValue,
		attribute,
		blockName,
		description,
		defaultValue,
		resetToDefault,
		getControlPath,
		//
		focusSide,
		setFocusSide,
		openPopover,
		setOpenPopover,
		marginDisable,
		paddingDisable,
		setControlClassName,
	};

	const marginAll = MarginAll(sideProps);
	const marginHorizontal = MarginHorizontal(sideProps);
	const marginVertical = MarginVertical(sideProps);
	const marginTop = MarginTop(sideProps);
	const marginRight = MarginRight(sideProps);
	const marginBottom = MarginBottom(sideProps);
	const marginLeft = MarginLeft(sideProps);

	const paddingAll = PaddingAll(sideProps);
	const paddingHorizontal = PaddingHorizontal(sideProps);
	const paddingVertical = PaddingVertical(sideProps);
	const paddingTop = PaddingTop(sideProps);
	const paddingRight = PaddingRight(sideProps);
	const paddingBottom = PaddingBottom(sideProps);
	const paddingLeft = PaddingLeft(sideProps);

	return (
		<BaseControl
			label={label}
			columns={columns}
			controlName={field}
			className={className}
			{...(label
				? {
						value,
						attribute,
						blockName,
						description,
						defaultValue,
						resetToDefault,
						mode: 'advanced',
				  }
				: {})}
		>
			<div
				{...props}
				className={controlClassNames(
					'box-spacing',
					'padding-lock-' + value.paddingLock,
					'margin-lock-' + value.marginLock,
					className,
					controlClassName
				)}
				data-cy="box-spacing-control"
			>
				<svg
					width="250"
					height="159"
					viewBox="0 0 250 159"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					{marginAll.shape}
					{marginHorizontal.shape}
					{marginVertical.shape}
					{marginTop.shape}
					{marginRight.shape}
					{marginBottom.shape}
					{marginLeft.shape}

					{paddingAll.shape}
					{paddingHorizontal.shape}
					{paddingVertical.shape}
					{paddingTop.shape}
					{paddingRight.shape}
					{paddingBottom.shape}
					{paddingLeft.shape}
				</svg>

				{marginAll.label}
				{marginHorizontal.label}
				{marginVertical.label}
				{marginTop.label}
				{marginRight.label}
				{marginBottom.label}
				{marginLeft.label}

				{paddingAll.label}
				{paddingHorizontal.label}
				{paddingVertical.label}
				{paddingTop.label}
				{paddingRight.label}
				{paddingBottom.label}
				{paddingLeft.label}

				<Margin {...sideProps} />

				<Padding {...sideProps} />
			</div>
		</BaseControl>
	);
}
