import { ActionTypes } from 'utils/constants';
import config from 'config';

const views = config.views ? config.views : {};
const viewType = views.displayType ? views.displayType : 'table';

const defaultView = views.defaultView ? views.defaultView : (viewType === 'switch' || viewType === 'table' ? 'table' : 'grid');

function currentViewCreator(id) {
    return function currentView(state = defaultView, action) {
        switch (action.type) {
            case `${ActionTypes.SWITCH_VIEW}_${id}`: {
                return action.payload;
            }
            default: {
                return state;
            }
        }
    }
}

export default currentViewCreator;