import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { validateOnChange } from 'redux/actions/items';
import { setItemProp } from 'redux/actions/modal-item-props';
import { fetchDatasource } from 'redux/actions/data-sources';
import getModuleReduxProp from 'utils/get-module-redux-prop';

import { getPropValue } from 'redux/selectors/get-prop-value';
import { getPropValidationErrors } from 'redux/selectors/get-prop-validation-errors';

import Field from './field';

function mapStateToProps(state, ownProps) {
    return {
        ...ownProps,
        value: getPropValue(state, ownProps),
        datasources: getModuleReduxProp(state, 'datasources'),
        validationErrors: getPropValidationErrors(state, ownProps)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            setItemProp,
            fetchDatasource,
            validateOnChange
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Field);
