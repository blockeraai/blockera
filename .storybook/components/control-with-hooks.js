/**
 * Blockera dependencies
 */
import { useControlContext } from '@blockera/controls';

const ControlWithHooks = ({ Control, ...args }) => {
	const {
		controlInfo: { name: controlId },
		dispatch: { modifyControlValue }, // eslint-disable-next-line
	} = useControlContext();

	return (
		<Control
			{...args}
			onChange={(newValue) =>
				modifyControlValue({
					controlId,
					value: newValue,
				})
			}
		/>
	);
};

export default ControlWithHooks;
