import React from 'react';
import {
  useRouteMatch, Switch, Route, useLocation,
} from 'react-router-dom';
import CompanySearchList from '../components/company/CompanySearchList';

function Company() {
  const match = useRouteMatch();
  const { cnpj } = new URLSearchParams(useLocation().search);
  return (
    <Switch>
      <Route path={match.path}>
        <CompanySearchList cnpj={cnpj || ''} />
      </Route>
    </Switch>
  );
}

export default Company;
