// @flow
/**
 * External dependencies
 */
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from '@wordpress/element';

export type VarPickerCustomAddAction = {
	onClick: () => void,
	label: string,
	dataTest?: string,
	canAdd: boolean,
	disabled?: boolean,
} | null;

type VarPickerCustomAddContextValue = {
	action: VarPickerCustomAddAction,
	register: (action: VarPickerCustomAddAction) => () => void,
};

const VarPickerCustomAddContext: React$Context<VarPickerCustomAddContextValue | null> =
	createContext(null);

export function VarPickerCustomAddProvider({
	children,
}: {
	children: React$Node,
}): React$Node {
	const [action, setAction] = useState<VarPickerCustomAddAction>(null);

	const register = useCallback((nextAction: VarPickerCustomAddAction) => {
		setAction(nextAction);
		return () => {
			setAction(null);
		};
	}, []);

	const value = useMemo(
		() => ({
			action,
			register,
		}),
		[action, register]
	);

	return (
		<VarPickerCustomAddContext.Provider value={value}>
			{children}
		</VarPickerCustomAddContext.Provider>
	);
}

export function useVarPickerCustomAddContext(): VarPickerCustomAddContextValue | null {
	return useContext(VarPickerCustomAddContext);
}
