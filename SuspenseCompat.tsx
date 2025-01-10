import React from 'react';

import {
  SuspenseCompatBoundary,
  SuspenseCompatBoundaryProps,
  ErrorBoundaryProps,
} from './suspense-compat';
import {MarkOptional} from 'ts-essentials';
import ErrorBoundary from './components/ErrorBoundary';
import {View} from './components/Themed';

export function SuspenseCompat({
  children,
  fallback = <View />,
  errorBoundaryComponent = ErrorComponent,
}: MarkOptional<
  SuspenseCompatBoundaryProps,
  'errorBoundaryComponent' | 'fallback'
>) {
  return (
    <SuspenseCompatBoundary
      fallback={fallback}
      errorBoundaryComponent={errorBoundaryComponent}>
      {children}
    </SuspenseCompatBoundary>
  );
}

function ErrorComponent(props: ErrorBoundaryProps) {
  if (!props.retry) {
    return <ErrorBoundary />;
  }

  return <View />;
}
