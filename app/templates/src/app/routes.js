import React from 'react';
import { Route, Redirect } from 'react-router';

import Template from './components/Template/Template';

/**
 * Define routes
 */
var routes = (
    <Route path="/" component={Template}>
        <Redirect from="*" to="/" />
    </Route>
);

export default routes;
