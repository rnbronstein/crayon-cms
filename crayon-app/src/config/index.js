import WidgetConfig from './widget-config';
import BitConfig from './bit-config';
import UsersConfig from './users-config';

const config = {
    clientName: 'Mike\'s Company',
    siteUrl: 'http://mikelinden.com',
    apiBase: 'http://localhost/php-crud-api',
    moduleOrder: ['bits', 'widgets', 'users'],
    modules: {
        widgets: WidgetConfig,
        bits: BitConfig,
        users: UsersConfig
    }
};

export default config;