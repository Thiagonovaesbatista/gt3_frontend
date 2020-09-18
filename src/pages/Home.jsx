import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h3>Bem-vindo</h3>
      Para acessar o conteúdo da aplicação navegue pelos menus abaixo
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/company">Company</Link>
            </li>
            <li>
              <Link to="/document-type">DocumentType</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Home;
