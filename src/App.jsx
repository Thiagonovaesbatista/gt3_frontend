import React from 'react';
import './App.scss';
import { Switch, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Company from './pages/Company';
import DocumentType from './pages/DocumentType';

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
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
