/**
 * WordPress dependencies
 */
import {
	__experimentalVStack as VStack,
	FlexItem, PanelBody,
	TextControl
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import RotateX from "./dimensions/rotate-x";
import RotateY from "./dimensions/rotate-y";
import RotateZ from "./dimensions/rotate-z";
import { useState } from "@wordpress/element";
import { InspectorControls } from "@wordpress/block-editor";

export default function transformControl(props) {
	const [angles, setAngles] = useState(
		{
			x: 0,
			y: 0,
			z: 0,
		}
	);

	return (
		<InspectorControls>
			<PanelBody
				title={__('Transform', 'publisher-blocks')}
				initialOpen={false}
			>
				<VStack justify="space-between">
					<FlexItem>
						<RotateX deg={transform.rotateX}/>

						<label htmlFor="my-text-input">{__('rotateX:', 'publisher-blocks')}</label>
						<TextControl
							id="my-text-input"
							value={transform.rotateX}
							onChange={
								(value) => {
									transform.rotateX = value;
									setAttributes({ ...transform });
								}
							}
						/>
					</FlexItem>
					<FlexItem>
						<RotateY deg={transform.rotateY}/>

						<label htmlFor="my-text-input">{__('rotateY:', 'publisher-blocks')}</label>
						<TextControl
							id="my-text-input"
							value={transform.rotateY}
							onChange={
								(value) => {
									transform.rotateY = value;
									setAttributes({ ...transform });
								}
							}
						/>
					</FlexItem>
					<FlexItem>
						<RotateZ angles={angles} setAngle={setAngles}/>

						<label htmlFor="my-text-input">{__('rotateZ:', 'publisher-blocks')}</label>
						<TextControl
							id="my-text-input"
							value={(angles.z || transform.rotateZ || 0) + 'deg'}
							onChange={
								(value) => {
									transform.rotateZ = value;
									setAttributes({ ...transform });
								}
							}
						/>
					</FlexItem>
				</VStack>
			</PanelBody>
		</InspectorControls>
	);
}
