import React from 'react';
import './App.scss';
import { Switch, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Company from './pages/Company';
import DocumentType from './pages/DocumentType';
import Contract from './pages/Contract';
import Home from './pages/Home';

function App() {
  return (
    <Layout title="Gestão de terceiros">
      <Switch>
        <Route path="/company">
          <Company />
        </Route>
        <Route path="/document-type">
          <DocumentType />
        </Route>
        <Route path="/contract">
          <Contract />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
