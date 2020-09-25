import React from 'react';
import {
  useRouteMatch, Switch, Route,
} from 'react-router-dom';
import ContractSearchList from '../components/contract/ContractSearchList';

function Contract() {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route path={match.path}>
        <ContractSearchList />
      </Route>
    </Switch>
  );
}

export default Contract;
