// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useRef } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';
import { useControlContext } from '../../context';
import type { Props } from './types';
import {
	Flex,
	Tooltip,
	SelectControl,
	CheckboxControl,
	ToggleSelectControl,
} from '../index';
import { MatrixItem } from './components/matrix-item';
// Matrix Icons
import MatrixNormalEmptyIcon from './matrix/matrix-normal-empty';
import MatrixNormalTopLeftIcon from './matrix/matrix-normal-top-left';
import MatrixNormalTopCenterIcon from './matrix/matrix-normal-top-center';
import MatrixNormalTopRightIcon from './matrix/matrix-normal-top-right';
import MatrixNormalCenterLeftIcon from './matrix/matrix-normal-center-left';
import MatrixNormalCenterCenterIcon from './matrix/matrix-normal-center-center';
import MatrixNormalCenterRightIcon from './matrix/matrix-normal-center-right';
import MatrixNormalBottomLeftIcon from './matrix/matrix-normal-bottom-left';
import MatrixNormalBottomCenterIcon from './matrix/matrix-normal-bottom-center';
import MatrixNormalBottomRightIcon from './matrix/matrix-normal-bottom-right';
import MatrixStretchFillIcon from './matrix/matrix-stretch-fill';
import MatrixSpaceAroundStartFillIcon from './matrix/matrix-space-around-start-fill';
import MatrixSpaceAroundCenterFillIcon from './matrix/matrix-space-around-center-fill';
import MatrixSpaceAroundEndFillIcon from './matrix/matrix-space-around-end-fill';
import MatrixSpaceBetweenStartFillIcon from './matrix/matrix-space-between-start-fill';
import MatrixSpaceBetweenCenterFillIcon from './matrix/matrix-space-between-center-fill';
import MatrixSpaceBetweenEndFillIcon from './matrix/matrix-space-between-end-fill';
import MatrixStretchSpaceBetweenIcon from './matrix/matrix-stretch-space-between';
import MatrixStretchSpaceAroundIcon from './matrix/matrix-stretch-space-around';

export default function LayoutMatrixControl({
	isDirectionActive = true,
	defaultDirection = '',
	isDenseActive = false,
	//
	id,
	label,
	labelPopoverTitle,
	labelDescription,
	columns,
	defaultValue = {
		direction: 'row',
		alignItems: '',
		justifyContent: '',
		dense: false,
	},
	onChange,
	field = 'layout-matrix',
	singularId,
	repeaterItem,
	//
	className,
	children,
}: Props): MixedElement {
	const {
		value,
		setValue,
		attribute,
		blockName,
		resetToDefault,
		getControlPath,
	} = useControlContext({
		id,
		onChange,
		defaultValue,
		mergeInitialAndDefault: true,
		valueCleanup: (data) => {
			if (!isDirectionActive) {
				delete data.direction;
			}

			if (!isDenseActive) {
				delete data.dense;
			}

			return data;
		},
	});

	const labelProps = {
		value,
		singularId,
		attribute,
		blockName,
		label,
		labelDescription,
		labelPopoverTitle,
		repeaterItem,
		defaultValue,
		resetToDefault,
		mode: 'advanced',
		path: getControlPath(attribute, id),
	};

	let matrixType = 'normal';

	if (value.alignItems === 'stretch') {
		if (value.justifyContent === 'space-around') {
			matrixType = 'stretch-space-around';
		} else if (value.justifyContent === 'space-between') {
			matrixType = 'stretch-space-between';
		} else {
			matrixType = 'stretch';
		}
	} else if (value.alignItems === 'stretch') {
		matrixType = 'stretch-space-around';
	} else if (value.justifyContent === 'space-around') {
		matrixType = 'space-around';
	} else if (value.justifyContent === 'space-between') {
		matrixType = 'space-between';
	}

	let direction = '';
	if (isDirectionActive) {
		direction =
			value?.direction || defaultValue?.direction || defaultDirection;
	} else {
		direction = defaultDirection || defaultValue?.direction || 'row';
	}

	const clickTimerRef = useRef();

	const onClickHandler = (
		event?: MouseEvent,
		itemEvent?: () => void
	): void => {
		clearTimeout(clickTimerRef.current);

		if (event?.detail === 1) {
			clickTimerRef.current = setTimeout(onClickHandler, 100);
		} else if (event?.detail === 2 && typeof itemEvent === 'function') {
			itemEvent();
		}
	};

	return (
		<BaseControl
			columns={columns}
			controlName={field}
			className={className}
			{...labelProps}
		>
			<Flex gap="10px" direction="column">
				<Flex
					gap="10px"
					direction="row"
					justifyContent="space-between"
					className={controlClassNames(
						'layout-matrix',
						'layout-matrix__direction-' + value.direction,
						'layout-matrix__align-items-' + value.alignItems,
						'layout-matrix__justify-content-' + value.justifyContent
					)}
				>
					<div
						className={controlInnerClassNames(
							'layout-matrix__grid',
							'layout-matrix__grid-type-' + matrixType
						)}
						data-test="layout-matrix"
					>
						{matrixType === 'normal' && (
							<>
								<MatrixItem
									id={'top-left'}
									selected={
										value.alignItems === 'flex-start' &&
										value.justifyContent === 'flex-start'
									}
									normalIcon={
										<MatrixNormalEmptyIcon
											direction={direction}
										/>
									}
									selectedIcon={
										<MatrixNormalTopLeftIcon
											direction={direction}
										/>
									}
									onClick={() => {
										setValue({
											...value,
											alignItems: 'flex-start',
											justifyContent: 'flex-start',
										});
									}}
									onMouseDown={(event: MouseEvent) => {
										onClickHandler(event, () => {
											setValue({
												...value,
												alignItems: 'flex-start',
												justifyContent: 'space-between',
											});
										});
									}}
								/>

								<MatrixItem
									id={'top-center'}
									selected={
										value.alignItems === 'flex-start' &&
										value.justifyContent === 'center'
									}
									normalIcon={
										<MatrixNormalEmptyIcon
											direction={direction}
										/>
									}
									selectedIcon={
										<MatrixNormalTopCenterIcon
											direction={direction}
										/>
									}
									onClick={() => {
										setValue({
											...value,
											alignItems: 'flex-start',
											justifyContent: 'center',
										});
									}}
									onMouseDown={(event: MouseEvent) => {
										onClickHandler(event, () => {
											if (direction === 'row') {
												setValue({
													...value,
													alignItems: 'flex-start',
													justifyContent:
														'space-between',
												});
											} else {
												setValue({
													...value,
													alignItems: 'center',
													justifyContent:
														'space-between',
												});
											}
										});
									}}
								/>

								<MatrixItem
									id={'top-right'}
									selected={
										value.alignItems === 'flex-start' &&
										value.justifyContent === 'flex-end'
									}
									normalIcon={
										<MatrixNormalEmptyIcon
											direction={direction}
										/>
									}
									selectedIcon={
										<MatrixNormalTopRightIcon
											direction={direction}
										/>
									}
									onClick={() => {
										setValue({
											...value,
											alignItems: 'flex-start',
											justifyContent: 'flex-end',
										});
									}}
									onMouseDown={(event: MouseEvent) => {
										onClickHandler(event, () => {
											if (direction === 'row') {
												setValue({
													...value,
													alignItems: 'flex-start',
													justifyContent:
														'space-between',
												});
											} else {
												setValue({
													...value,
													alignItems: 'flex-end',
													justifyContent:
														'space-between',
												});
											}
										});
									}}
								/>

								<MatrixItem
									id={'center-left'}
									selected={
										value.alignItems === 'center' &&
										value.justifyContent === 'flex-start'
									}
									normalIcon={
										<MatrixNormalEmptyIcon
											direction={direction}
										/>
									}
									selectedIcon={
										<MatrixNormalCenterLeftIcon
											direction={direction}
										/>
									}
									onClick={() => {
										setValue({
											...value,
											alignItems: 'center',
											justifyContent: 'flex-start',
										});
									}}
									onMouseDown={(event: MouseEvent) => {
										onClickHandler(event, () => {
											if (direction === 'row') {
												setValue({
													...value,
													alignItems: 'center',
													justifyContent:
														'space-between',
												});
											} else {
												setValue({
													...value,
													alignItems: 'flex-start',
													justifyContent:
														'space-between',
												});
											}
										});
									}}
								/>

								<MatrixItem
									id={'center-center'}
									selected={
										value.alignItems === 'center' &&
										value.justifyContent === 'center'
									}
									normalIcon={
										<MatrixNormalEmptyIcon
											direction={direction}
										/>
									}
									selectedIcon={
										<MatrixNormalCenterCenterIcon
											direction={direction}
										/>
									}
									onClick={() => {
										setValue({
											...value,
											alignItems: 'center',
											justifyContent: 'center',
										});
									}}
									onMouseDown={(event: MouseEvent) => {
										onClickHandler(event, () => {
											setValue({
												...value,
												alignItems: 'center',
												justifyContent: 'space-between',
											});
										});
									}}
								/>

								<MatrixItem
									id={'center-right'}
									selected={
										value.alignItems === 'center' &&
										value.justifyContent === 'flex-end'
									}
									normalIcon={
										<MatrixNormalEmptyIcon
											direction={direction}
										/>
									}
									selectedIcon={
										<MatrixNormalCenterRightIcon
											direction={direction}
										/>
									}
									onClick={() => {
										setValue({
											...value,
											alignItems: 'center',
											justifyContent: 'flex-end',
										});
									}}
									onMouseDown={(event: MouseEvent) => {
										onClickHandler(event, () => {
											if (direction === 'row') {
												setValue({
													...value,
													alignItems: 'center',
													justifyContent:
														'space-between',
												});
											} else {
												setValue({
													...value,
													alignItems: 'flex-end',
													justifyContent:
														'space-between',
												});
											}
										});
									}}
								/>

								<MatrixItem
									id={'bottom-left'}
									selected={
										value.alignItems === 'flex-end' &&
										value.justifyContent === 'flex-start'
									}
									normalIcon={
										<MatrixNormalEmptyIcon
											direction={direction}
										/>
									}
									selectedIcon={
										<MatrixNormalBottomLeftIcon
											direction={direction}
										/>
									}
									onClick={() => {
										setValue({
											...value,
											alignItems: 'flex-end',
											justifyContent: 'flex-start',
										});
									}}
									onMouseDown={(event: MouseEvent) => {
										onClickHandler(event, () => {
											if (direction === 'row') {
												setValue({
													...value,
													alignItems: 'flex-end',
													justifyContent:
														'space-between',
												});
											} else {
												setValue({
													...value,
													alignItems: 'flex-start',
													justifyContent:
														'space-between',
												});
											}
										});
									}}
								/>

								<MatrixItem
									id={'bottom-center'}
									selected={
										value.alignItems === 'flex-end' &&
										value.justifyContent === 'center'
									}
									normalIcon={
										<MatrixNormalEmptyIcon
											direction={direction}
										/>
									}
									selectedIcon={
										<MatrixNormalBottomCenterIcon
											direction={direction}
										/>
									}
									onClick={() => {
										setValue({
											...value,
											alignItems: 'flex-end',
											justifyContent: 'center',
										});
									}}
									onMouseDown={(event: MouseEvent) => {
										onClickHandler(event, () => {
											if (direction === 'row') {
												setValue({
													...value,
													alignItems: 'flex-end',
													justifyContent:
														'space-between',
												});
											} else {
												setValue({
													...value,
													alignItems: 'center',
													justifyContent:
														'space-between',
												});
											}
										});
									}}
								/>

								<MatrixItem
									id={'bottom-right'}
									selected={
										value.alignItems === 'flex-end' &&
										value.justifyContent === 'flex-end'
									}
									normalIcon={
										<MatrixNormalEmptyIcon
											direction={direction}
										/>
									}
									selectedIcon={
										<MatrixNormalBottomRightIcon
											direction={direction}
										/>
									}
									onClick={() => {
										setValue({
											...value,
											alignItems: 'flex-end',
											justifyContent: 'flex-end',
										});
									}}
									onMouseDown={(event: MouseEvent) => {
										onClickHandler(event, () => {
											setValue({
												...value,
												alignItems: 'flex-end',
												justifyContent: 'space-between',
											});
										});
									}}
								/>
							</>
						)}

						{matrixType === 'stretch-space-around' && (
							<>
								<MatrixItem
									id={'stretch-space-around'}
									selected={
										value.alignItems === 'stretch' &&
										value.justifyContent === 'space-around'
									}
									normalIcon={
										<MatrixStretchSpaceAroundIcon
											direction={direction}
										/>
									}
									selectedIcon={
										<MatrixStretchSpaceAroundIcon
											direction={direction}
										/>
									}
									onClick={() => {
										setValue({
											...value,
											alignItems: 'stretch',
											justifyContent: 'space-around',
										});
									}}
									onMouseDown={(event: MouseEvent) => {
										onClickHandler(event, () => {
											setValue({
												...value,
												alignItems: 'center',
												justifyContent: 'center',
											});
										});
									}}
								/>
							</>
						)}

						{matrixType === 'stretch-space-between' && (
							<>
								<MatrixItem
									id={'stretch-space-between'}
									selected={
										value.alignItems === 'stretch' &&
										value.justifyContent === 'space-between'
									}
									normalIcon={
										<MatrixStretchSpaceBetweenIcon
											direction={direction}
										/>
									}
									selectedIcon={
										<MatrixStretchSpaceBetweenIcon
											direction={direction}
										/>
									}
									onClick={() => {
										setValue({
											...value,
											alignItems: 'stretch',
											justifyContent: 'space-between',
										});
									}}
									onMouseDown={(event: MouseEvent) => {
										onClickHandler(event, () => {
											setValue({
												...value,
												alignItems: 'center',
												justifyContent: 'center',
											});
										});
									}}
								/>
							</>
						)}

						{matrixType === 'stretch' && (
							<>
								<MatrixItem
									id={'start'}
									selected={
										value.alignItems === 'stretch' &&
										value.justifyContent === 'flex-start'
									}
									normalIcon={
										<MatrixStretchFillIcon
											direction={direction}
										/>
									}
									selectedIcon={
										<MatrixStretchFillIcon
											direction={direction}
										/>
									}
									onClick={() => {
										setValue({
											...value,
											alignItems: 'stretch',
											justifyContent: 'flex-start',
										});
									}}
									onMouseDown={(event: MouseEvent) => {
										onClickHandler(event, () => {
											setValue({
												...value,
												alignItems: 'center',
												justifyContent: 'flex-start',
											});
										});
									}}
								/>

								<MatrixItem
									id={'center'}
									selected={
										value.alignItems === 'stretch' &&
										value.justifyContent === 'center'
									}
									normalIcon={
										<MatrixStretchFillIcon
											direction={direction}
										/>
									}
									selectedIcon={
										<MatrixStretchFillIcon
											direction={direction}
										/>
									}
									onClick={() => {
										setValue({
											...value,
											alignItems: 'stretch',
											justifyContent: 'center',
										});
									}}
									onMouseDown={(event: MouseEvent) => {
										onClickHandler(event, () => {
											setValue({
												...value,
												alignItems: 'center',
												justifyContent: 'center',
											});
										});
									}}
								/>

								<MatrixItem
									id={'end'}
									selected={
										value.alignItems === 'stretch' &&
										value.justifyContent === 'flex-end'
									}
									normalIcon={
										<MatrixStretchFillIcon
											direction={direction}
										/>
									}
									selectedIcon={
										<MatrixStretchFillIcon
											direction={direction}
										/>
									}
									onClick={() => {
										setValue({
											...value,
											alignItems: 'stretch',
											justifyContent: 'flex-end',
										});
									}}
									onMouseDown={(event: MouseEvent) => {
										onClickHandler(event, () => {
											setValue({
												...value,
												alignItems: 'center',
												justifyContent: 'flex-end',
											});
										});
									}}
								/>
							</>
						)}

						{matrixType === 'space-around' && (
							<>
								<MatrixItem
									id={'start'}
									selected={
										value.alignItems === 'flex-start' &&
										value.justifyContent === 'space-around'
									}
									normalIcon={
										<MatrixSpaceAroundStartFillIcon
											direction={direction}
										/>
									}
									selectedIcon={
										<MatrixSpaceAroundStartFillIcon
											direction={direction}
										/>
									}
									onClick={() => {
										setValue({
											...value,
											alignItems: 'flex-start',
											justifyContent: 'space-around',
										});
									}}
									onMouseDown={(event: MouseEvent) => {
										onClickHandler(event, () => {
											setValue({
												...value,
												alignItems: 'stretch',
												justifyContent: 'flex-start',
											});
										});
									}}
								/>

								<MatrixItem
									id={'center'}
									selected={
										value.alignItems === 'center' &&
										value.justifyContent === 'space-around'
									}
									normalIcon={
										<MatrixSpaceAroundCenterFillIcon
											direction={direction}
										/>
									}
									selectedIcon={
										<MatrixSpaceAroundCenterFillIcon
											direction={direction}
										/>
									}
									onClick={() => {
										setValue({
											...value,
											alignItems: 'center',
											justifyContent: 'space-around',
										});
									}}
									onMouseDown={(event: MouseEvent) => {
										onClickHandler(event, () => {
											setValue({
												...value,
												alignItems: 'stretch',
												justifyContent: 'center',
											});
										});
									}}
								/>

								<MatrixItem
									id={'end'}
									selected={
										value.alignItems === 'flex-end' &&
										value.justifyContent === 'space-around'
									}
									normalIcon={
										<MatrixSpaceAroundEndFillIcon
											direction={direction}
										/>
									}
									selectedIcon={
										<MatrixSpaceAroundEndFillIcon
											direction={direction}
										/>
									}
									onClick={() => {
										setValue({
											...value,
											alignItems: 'flex-end',
											justifyContent: 'space-around',
										});
									}}
									onMouseDown={(event: MouseEvent) => {
										onClickHandler(event, () => {
											setValue({
												...value,
												alignItems: 'stretch',
												justifyContent: 'flex-end',
											});
										});
									}}
								/>
							</>
						)}

						{matrixType === 'space-between' && (
							<>
								<MatrixItem
									id={'start'}
									selected={
										value.alignItems === 'flex-start' &&
										value.justifyContent === 'space-between'
									}
									normalIcon={
										<MatrixSpaceBetweenStartFillIcon
											direction={direction}
										/>
									}
									selectedIcon={
										<MatrixSpaceBetweenStartFillIcon
											direction={direction}
										/>
									}
									onClick={() => {
										setValue({
											...value,
											alignItems: 'flex-start',
											justifyContent: 'space-between',
										});
									}}
									onMouseDown={(event: MouseEvent) => {
										onClickHandler(event, () => {
											setValue({
												...value,
												alignItems: 'flex-start',
												justifyContent: 'space-around',
											});
										});
									}}
								/>

								<MatrixItem
									id={'center'}
									selected={
										value.alignItems === 'center' &&
										value.justifyContent === 'space-between'
									}
									normalIcon={
										<MatrixSpaceBetweenCenterFillIcon
											direction={direction}
										/>
									}
									selectedIcon={
										<MatrixSpaceBetweenCenterFillIcon
											direction={direction}
										/>
									}
									onClick={() => {
										setValue({
											...value,
											alignItems: 'center',
											justifyContent: 'space-between',
										});
									}}
									onMouseDown={(event: MouseEvent) => {
										onClickHandler(event, () => {
											setValue({
												...value,
												alignItems: 'center',
												justifyContent: 'space-around',
											});
										});
									}}
								/>

								<MatrixItem
									id={'end'}
									selected={
										value.alignItems === 'flex-end' &&
										value.justifyContent === 'space-between'
									}
									normalIcon={
										<MatrixSpaceBetweenEndFillIcon
											direction={direction}
										/>
									}
									selectedIcon={
										<MatrixSpaceBetweenEndFillIcon
											direction={direction}
										/>
									}
									onClick={() => {
										setValue({
											...value,
											alignItems: 'flex-end',
											justifyContent: 'space-between',
										});
									}}
									onMouseDown={(event: MouseEvent) => {
										onClickHandler(event, () => {
											setValue({
												...value,
												alignItems: 'flex-end',
												justifyContent: 'space-around',
											});
										});
									}}
								/>
							</>
						)}
					</div>

					<Flex
						direction="column"
						justifyContent="space-between"
						className={controlInnerClassNames(
							'layout-matrix__controls'
						)}
					>
						{isDirectionActive && (
							<ToggleSelectControl
								id="direction"
								label=""
								options={[
									{
										label: __('Row', 'blockera'),
										value: 'row',
										icon: (
											<Icon
												icon="flex-direction-row"
												iconSize="18"
											/>
										),
									},
									{
										label: __('Column', 'blockera'),
										value: 'column',
										icon: (
											<Icon
												icon="flex-direction-column"
												iconSize="18"
											/>
										),
									},
								]}
								defaultValue={direction}
								onChange={(newValue) =>
									setValue({
										...value,
										direction: newValue,
									})
								}
							/>
						)}

						<Flex direction="row" justifyContent="space-between">
							<SelectControl
								id="alignItems"
								controlName="select"
								label=""
								options={[
									{
										label: __('Empty', 'blockera'),
										value: '',
										icon: (
											<Icon
												icon="flex-align-empty"
												iconSize="18"
												data-test="layout-matrix-align-empty"
											/>
										),
									},
									{
										label: __('Start', 'blockera'),
										value: 'flex-start',
										icon: (
											<Icon
												icon="flex-align-start"
												iconSize="18"
												data-test="layout-matrix-align-start"
											/>
										),
									},
									{
										label: __('Center', 'blockera'),
										value: 'center',
										icon: (
											<Icon
												icon="flex-align-center"
												iconSize="18"
												data-test="layout-matrix-align-center"
											/>
										),
									},
									{
										label: __('End', 'blockera'),
										value: 'flex-end',
										icon: (
											<Icon
												icon="flex-align-end"
												iconSize="18"
												data-test="layout-matrix-align-end"
											/>
										),
									},
									{
										label: __('Stretch', 'blockera'),
										value: 'stretch',
										icon: (
											<Icon
												icon="flex-align-stretch"
												iconSize="18"
												data-test="layout-matrix-align-stretch"
											/>
										),
									},
								]}
								onChange={(newValue) =>
									setValue({
										...value,
										alignItems: newValue,
									})
								}
								type="custom"
								defaultValue={defaultValue.alignItems}
								className="input-hide-label input-hide-caret layout-matrix__align-items"
							/>

							<SelectControl
								id="justifyContent"
								controlName="select"
								label=""
								options={[
									{
										label: __('Empty', 'blockera'),
										value: '',
										icon: (
											<Icon
												icon="justify-content-empty"
												iconSize="18"
												data-test="layout-matrix-justify-empty"
											/>
										),
									},
									{
										label: __('Start', 'blockera'),
										value: 'flex-start',
										icon: (
											<Icon
												icon="justify-content-start"
												iconSize="18"
												className="blockera-flex-justify-content-flex-start"
												data-test="layout-matrix-justify-start"
											/>
										),
									},
									{
										label: __('Center', 'blockera'),
										value: 'center',
										icon: (
											<Icon
												icon="justify-content-center"
												iconSize="18"
												data-test="layout-matrix-justify-center"
											/>
										),
									},
									{
										label: __('End', 'blockera'),
										value: 'flex-end',
										icon: (
											<Icon
												icon="justify-content-end"
												iconSize="18"
												className="blockera-flex-justify-content-flex-end"
												data-test="layout-matrix-justify-end"
											/>
										),
									},
									{
										label: __('Space Around', 'blockera'),
										value: 'space-around',
										icon: (
											<Icon
												icon="justify-content-space-around"
												iconSize="18"
												data-test="layout-matrix-justify-around"
											/>
										),
									},
									{
										label: __('Space Between', 'blockera'),
										value: 'space-between',
										icon: (
											<Icon
												icon="justify-content-space-between"
												iconSize="18"
												data-test="layout-matrix-justify-between"
											/>
										),
									},
								]}
								onChange={(newValue) =>
									setValue({
										...value,
										justifyContent: newValue,
									})
								}
								type="custom"
								defaultValue={defaultValue.justifyContent}
								className="input-hide-label input-hide-caret layout-matrix__justify-content"
							/>
						</Flex>
					</Flex>
				</Flex>

				{isDenseActive && (
					<CheckboxControl
						id="dense"
						checkboxLabel={
							<>
								{__('Dense', 'blockera')}
								<Tooltip
									text={
										<span
											style={{
												width: '210px',
												display: 'block',
												textAlign: 'left',
												textWrap: 'pretty',
											}}
										>
											<b>
												{__('Dense mode:', 'blockera')}{' '}
											</b>
											{__(
												'fills empty spaces with items that fit, potentially changing their visual order.',
												'blockera'
											)}
										</span>
									}
								>
									<span>
										<Icon
											icon="information"
											iconSize="18"
											style={{
												opacity: '30%',
											}}
										/>
									</span>
								</Tooltip>
							</>
						}
						onChange={(newValue) =>
							setValue({
								...value,
								dense: newValue,
							})
						}
					/>
				)}

				{children}
			</Flex>
		</BaseControl>
	);
}
