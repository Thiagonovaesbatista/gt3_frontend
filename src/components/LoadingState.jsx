import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import './LoadingState.scss';

function LoadingState() {
  return (
    <div className="container-loading-state">
      <ProgressSpinner className="spinner" />
    </div>
  );
}

export default LoadingState;
