import { __ } from '@wordpress/i18n';
import {
	Button,
	__experimentalSpacer as Spacer,
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';

const Separator = ({ label }) => {
	return (
		<div className="p-blocks-items__operator-wrapper">
			<div className="p-blocks-items__operator-line"></div>
			<div className="p-blocks-items__operator-word">
				<span>{label}</span>
			</div>
		</div>
	);
};

export default function RepeaterItem({
	group,
	index,
	innerItem,
	attributes,
	removeGroup,
	changeValue,
	setAttributes,
	changeVisibility,
	toggleVisibility,
}) {
	return (
		<Fragment key={index}>
			<Spacer>
				{group && group.map((i, n) => {
					return innerItem(i, n, {
						group,
						toggleVisibility,
						attributes,
						setAttributes,
						changeValue,
						changeVisibility,
						index,
						removeGroup,
					})
				})}
			</Spacer>

			{/* {1 < attributes.repeaterItems.length &&
				index !==
				attributes.repeaterItems.length - 1 && (
					<Separator
						label={__('OR', 'publisher-blocks')}
					/>
				)} */}
		</Fragment>
	);
}
