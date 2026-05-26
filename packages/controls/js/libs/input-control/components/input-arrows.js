// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { controlClassNames } from '@blockera/classnames';
import { isEmpty } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { default as ArrowUpIcon } from '../icons/arrow-up';
import { default as ArrowDownIcon } from '../icons/arrow-down';

export function InputArrows({
	value,
	setValue,
	disabled,
	min,
	max,
	size,
}: {
	value: string | number,
	setValue: (value: number) => void,
	disabled?: boolean,
	min?: number,
	max?: number,
	size?: string,
}): MixedElement {
	if (['extra-small'].includes(size)) {
		return <></>;
	}

	return (
		<div
			className={controlClassNames(
				'input-arrows',
				disabled && 'is-disabled'
			)}
			data-test="arrows-container"
		>
			<span
				className={controlClassNames(
					'input-arrow',
					'input-arrow-up',
					!isEmpty(max) && +value >= +max ? 'is-disabled' : ''
				)}
				onClick={() => {
					if (disabled) return;
					let newValue = !isEmpty(value) ? +value : 0;
					newValue += 1;

					if (!isEmpty(max) && newValue > +max) {
						newValue = +max;
					}

					setValue(newValue);
				}}
				data-test="arrow-up"
			>
				<ArrowUpIcon />
			</span>

			<span
				className={controlClassNames(
					'input-arrow',
					'input-arrow-down',
					!isEmpty(min) && +value <= +min ? 'is-disabled' : ''
				)}
				onClick={() => {
					if (disabled) return;
					let newValue = !isEmpty(value) ? +value : 0;
					newValue -= 1;

					if (!isEmpty(min) && newValue <= +min) {
						newValue = +min;
					}

					setValue(newValue);
				}}
				data-test="arrow-down"
			>
				<ArrowDownIcon />
			</span>
		</div>
	);
}
