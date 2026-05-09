/**
 * Blockera dependencies
 */
import { LabelControl } from '@blockera/controls';
import { controlInnerClassNames } from '@blockera/classnames';

export type TaxonomyGroupHeaderProps = {
	label: string;
};

export function TaxonomyGroupHeader({ label }: TaxonomyGroupHeaderProps) {
	return (
		<div className={controlInnerClassNames('header')}>
			<LabelControl label={label} mode="simple" />
		</div>
	);
}
