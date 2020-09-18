import React from 'react';
import {
  useRouteMatch, Switch, Route,
} from 'react-router-dom';
import DocumentTypeDataTable from '../components/document-type/DocumentTypeDataTable';

function DocumentType() {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route path={match.path}>
        <DocumentTypeDataTable />
      </Route>
    </Switch>
  );
}

export default DocumentType;
