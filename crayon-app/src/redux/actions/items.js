import { ActionTypes, API_ENDPOINT } from 'utils/constants';
import config from 'config';

import axios from 'axios';

import { arrayMove } from 'react-sortable-hoc';

const pluginId = 123;

export function fetchItems() {
    return (dispatch, getState) => {
        const state = getState();

        const moduleConfig = config.modules[state.currentModule];
        startPolling(dispatch, state.currentModule);

        const wpAction = `get_${moduleConfig.id}`;
        const action = {};

        action.type = `${ActionTypes.FETCH_ITEMS}_${state.currentModule}`;
        action.payload = axios.get(`${API_ENDPOINT}?action=${wpAction}`);

        dispatch(action);
    };
};

export function startPolling(dispatch, moduleId) {
    setTimeout(() => refreshItems(dispatch, moduleId), 30000);
}

function refreshItems(dispatch, moduleId) {
    const wpAction = `get_${pluginId}`;

    axios.get(`${API_ENDPOINT}?action=${wpAction}`).then((data) => {
        dispatch({
            type: `${ActionTypes.FETCH_ITEMS}_${moduleId}_FULFILLED`,
            payload: data
        });

        startPolling(dispatch);
    })
}

export function validateOnChange() {
    return (dispatch, getState) => {
        const state = getState();
        const data = state.modalItemProps;

        validateItems(data, dispatch, state.currentModule);
    };
}

function validateItems(data, dispatch, moduleId) {
    const errors = [];

    const moduleConfig = config.modules[moduleId];

    moduleConfig.itemProps.forEach((item) => {
        const val = data[item.name] ? data[item.name] : '';

        if (item.required && val.trim() === '') {
            errors.push({
                itemName: item.name,
                msg: `${item.label} is required`
            });
        }

        if (item.minLength && val !== '' && val.length < item.minLength) {
            errors.push({
                itemName: item.name,
                msg: `${item.label} must be at least ${item.minLength} characters long`
            });
        }

        if (item.maxLength && val !== '' && val.length > item.maxLength) {
            errors.push({
                itemName: item.name,
                msg: `${item.label} must be less than ${item.maxLength} characters long`
            });
        }

        if (item.regexFormat && val !== '' && !item.regexFormat.test(val)) {
            errors.push({
                itemName: item.name,
                msg: item.regexErrorText
            });
        }
    });

    dispatch({
        type: `${ActionTypes.VALIDATION_CHECK}_${moduleId}`,
        payload: errors
    });

    return !errors.length > 0;
}

export function saveNewItem(data) {
    return (dispatch, getState) => {
        const state = getState();
        const moduleId = state.currentModule;

        const valid = validateItems(data, dispatch);

        if (valid) {
            const wpAction = `post_${pluginId}`;
            const action = {};

            action.type = `${ActionTypes.SAVE_NEW_ITEM}_${moduleId}`;
            action.payload = axios.post(`${API_ENDPOINT}?action=${wpAction}`, data);

            dispatch(action);
        }
    };
};

export function editItem(item) {
    return (dispatch, getState) => {
        const state = getState();
        const moduleId = state.currentModule;

        dispatch({
            type: `${ActionTypes.EDIT_ITEM}_${moduleId}`,
            payload: item
        });
    };
}

export function saveEditItem(data) {
    return (dispatch, getState) => {
        const state = getState();
        const moduleId = state.currentModule;
        const valid = validateItems(data, dispatch);

        if (valid) {
            dispatch({
                type: `${ActionTypes.SAVE_EDIT_ITEM}_${moduleId}`,
                payload: data
            });

            const wpAction = `put_${pluginId}`;

            const action = {};

            action.type = `${ActionTypes.SAVE_EDIT_ITEM}_${moduleId}`;
            action.payload = axios.put(`${API_ENDPOINT}?action=${wpAction}`, data);

            dispatch(action);
        }
    };
};

export function deleteItem(item) {
    return (dispatch, getState) => {
        const state = getState();

        const moduleId = state.currentModule;
        const moduleConfig = config.modules[moduleId];

        const { capabilities, itemName } = moduleConfig;

        const localDeleteIdProp = capabilities.deleteIdProp ? capabilities.deleteIdProp : 'name';
        const name = item[localDeleteIdProp];

        const itemIdentifier = name ? `\n\n${name}` : '';

        if (window.confirm(`Are you sure you want to delete this ${itemName.toLowerCase()}?${itemIdentifier}`)) {
            dispatch({
                type: `${ActionTypes.DELETE_ITEM}_${moduleId}`,
                payload: item.id
            });

            const wpAction = `delete_${pluginId}`;
            const action = {};

            action.type = `${ActionTypes.DELETE_ITEM}_${moduleId}`;
            action.payload = axios.delete(`${API_ENDPOINT}?action=${wpAction}&id=${item.id}`);

            dispatch(action);
        }
    };
};

export function sortEnd(items, oldIndex, newIndex) {
    return (dispatch, getState) => {
        const state = getState();
        const moduleId = state.currentModule;

        let newItems = arrayMove(items, oldIndex, newIndex);
        newItems = newItems.map((mod, i) => {
            mod.sort = i;
            return mod;
        });

        dispatch({
            type: `${ActionTypes.ITEM_SORT_END}_${moduleId}`,
            payload: newItems
        });

        const payload = newItems.reduce((collector, i) => {
            collector[`item_${i.id}`] = i.sort;
            return collector;
        }, {});

        const wpAction = `sort_${pluginId}`;
        const action = {};

        action.type = `${ActionTypes.ITEM_SORT_END}_${moduleId}`;
        action.payload = axios.post(`${API_ENDPOINT}?action=${wpAction}`, payload);

        dispatch(action);
    };
}