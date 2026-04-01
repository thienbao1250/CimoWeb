import { ComponentType, LazyExoticComponent, Suspense } from 'react';

// material-ui
import { LinearProgressProps } from '@mui/material/LinearProgress';

// project imports
import Loader from './Loader';

type LoaderProps = LinearProgressProps;

const Loadable = (Component: LazyExoticComponent<() => JSX.Element> | ComponentType<any>) => (props: LoaderProps) => (
  <Suspense fallback={<Loader />}>
    <Component {...props} />
  </Suspense>
);

export default Loadable;
