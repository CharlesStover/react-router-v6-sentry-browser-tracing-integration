# Sentry browser tracing integration for React Router v6

[![version](https://img.shields.io/npm/v/react-router-v6-instrumentation.svg)](https://www.npmjs.com/package/react-router-v6-instrumentation)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/react-router-v6-instrumentation.svg)](https://www.npmjs.com/package/react-router-v6-instrumentation)
[![downloads](https://img.shields.io/npm/dt/react-router-v6-instrumentation.svg)](https://www.npmjs.com/package/react-router-v6-instrumentation)
[![GitHub Action: Push](https://github.com/CharlesStover/react-router-v6-instrumentation/actions/workflows/push.yml/badge.svg)](https://github.com/CharlesStover/react-router-v6-instrumentation/actions/workflows/push.yml)

Easy React Router v6 instrumentation for Sentry

## Install

- `npm install react-router-v6-instrumentation` or
- `yarn add react-router-v6-instrumentation`

## Use

```javascript
import { init } from '@sentry/react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router';
import useBrowserTracing from 'react-router-v6-instrumentation';

function App() {
  const browserTracing = useBrowserTracing();

  // Initialize Sentry with the browser tracing integration.
  useEffect(() => {
    init({
      integrations: [browserTracing],
    });
  }, [browserTracing]);

  return <>Hello world!</>;
}

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root'),
);
```

**Note:** For the `useBrowserTracing` hook to work, it must be called from a
component that is nested inside your `BrowserRouter` (or `MemoryRouter`)
component.

## Contributing

To contribute to this repository, start by running the following commands.

- To keep Yarn up to date, run `yarn set version latest`.
- To keep dependencies up to date, run `yarn up "*" "@*/*"`.
- If you use VIM, run `yarn sdks vim`.
- If you use Visual Studio Code, run `yarn sdks vscode`.

To test your changes for validity, use the following scripts:

- To build your changes, run `yarn rollup`.
- To build your changes in watch mode, run `yarn rollup:watch`.
- To lint your changes, run `yarn eslint`.
- To unit test your changes, run `yarn jest`.
- To unit test your changes in watch mode, run `yarn jest:watch`.
