import { createSelector } from 'reselect';

const fieldName = (state, props) => props.name;
const itemProps = (state) => state[state.currentModule].modalItemProps;

export const getPropValue = createSelector(
    [ fieldName, itemProps ],
    (name, itemProps) => {
        const value = itemProps[name];
        return value ? value : '';
    }
);
