import {ErrorBoundaryProps} from './suspense-compat';

export function renderNonLocalizableErrorBoundary(props: ErrorBoundaryProps) {
  console.error(props.error);
  return null;
}
