/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	__experimentalView as View,
	__experimentalSpacer as Spacer,
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { useCallback, memo, useContext } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	RepeaterContext,
	useControlContext,
	GradientBarControl,
	ControlContextProvider,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import { SharedPresetControls } from '../components';
import { type VariableType } from '../components/types';
import { getAllVariableSlugs as getAllGradientSlugs } from '../components/utils';

interface GradientPresetFieldsProps {
	origin: string | string[];
	presetId: string | number;
	gradientItem: VariableType & { gradient?: string };
	gradientType: 'linear-gradient' | 'radial-gradient';
}

function GradientPresetFieldsComponent({
	origin,
	presetId,
	gradientType,
	gradientItem,
}: GradientPresetFieldsProps) {
	const { slug } = gradientItem;

	const {
		controlInfo: { name: controlId },
		dispatch: { changeRepeaterItem },
	} = useControlContext();
	const {
		onChange,
		repeaterId,
		valueCleanup,
		repeaterItems: gradients,
	} = useContext(RepeaterContext) as {
		onChange: (newValue: any) => void;
		valueCleanup: (value: any) => any;
		repeaterId: string | null | undefined;
		repeaterItems: (VariableType & { gradient?: string })[];
		getControlId?: (itemId: string | number, key: string) => string;
	};

	const updateGradientViaRepeater = useCallback(
		(updates: Record<string, any>) => {
			changeRepeaterItem({
				onChange,
				valueCleanup,
				controlId,
				repeaterId,
				itemId: presetId,
				value: { ...gradientItem, ...updates },
			});
		},
		[
			changeRepeaterItem,
			onChange,
			valueCleanup,
			controlId,
			repeaterId,
			presetId,
			gradientItem,
		]
	);

	const handleGradientChange = useCallback(
		(newValue: string | undefined) => {
			updateGradientViaRepeater({ gradient: newValue });
		},
		[updateGradientViaRepeater]
	);

	if (!origin || !slug) {
		return null;
	}

	const label =
		gradientType === 'linear-gradient'
			? __('Linear Gradient', 'blockera')
			: __('Radial Gradient', 'blockera');

	const gradientValueControls = (
		<ControlContextProvider
			value={{
				name: `gradient-value-${slug}`,
				value: gradientItem.gradient,
				attribute: 'blockeraGradient',
				blockName: 'global-styles',
			}}
		>
			<GradientBarControl
				label={label}
				field="gradient-bar"
				height={40}
				columns="columns-2"
				onChange={handleGradientChange}
			/>
		</ControlContextProvider>
	);

	return (
		<VStack spacing={4}>
			<View>
				<Spacer paddingX={4} marginBottom={0} paddingBottom={6}>
					<VStack spacing={4}>
						<SharedPresetControls
							itemId={presetId}
							variable={gradientItem}
							name={gradientItem.name}
							slug={gradientItem.slug}
							allSlugs={getAllGradientSlugs(gradients as any)}
						>
							{gradientValueControls}
						</SharedPresetControls>
					</VStack>
				</Spacer>
			</View>
		</VStack>
	);
}

export const GradientPresetFields = memo(GradientPresetFieldsComponent);
