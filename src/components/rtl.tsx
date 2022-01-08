import { useEffect } from 'react';
import type { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import stylisRTLPlugin from 'stylis-plugin-rtl';

interface RTLProps {
  children: ReactNode;
  direction: 'ltr' | 'rtl';
}

const styleCache = () => createCache({
  key: 'rtl',
  prepend: true,
  stylisPlugins: [stylisRTLPlugin]
});

export const RTL: FC<RTLProps> = (props) => {
  const { children, direction } = props;

  useEffect(() => {
    document.dir = direction;
  }, [direction]);

  if (direction === 'rtl') {
    return (
      <CacheProvider value={styleCache()}>
        {children}
      </CacheProvider>
    );
  }

  return <>{children}</>;
};

RTL.propTypes = {
  children: PropTypes.node.isRequired,
  direction: PropTypes.oneOf(['ltr', 'rtl'])
};
