/**
 * Publisher dependencies
 */
import { useControlContext } from '@publisher/controls';

const ControlWithHooks = ({ Control, ...args }) => {
	const {
		value,
		controlInfo: { name: controlId },
		dispatch: { modifyControlValue },
		// eslint-disable-next-line
	} = useControlContext();

	return (
		<Control
			{...args}
			value={value}
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
