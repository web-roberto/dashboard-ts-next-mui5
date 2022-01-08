import { useState } from 'react';
import type { FC } from 'react';
import { styled } from '@mui/material/styles';
import { DocsNavbar } from './docs-navbar';
import { DocsSidebar } from './docs-sidebar';

const DocsLayoutRoot = styled('div')(
  ({ theme }) => ({
    minHeight: 'calc(100vh - 64px)',
    paddingTop: 64,
    [theme.breakpoints.up('lg')]: {
      marginLeft: 256
    }
  })
);

export const DocsLayout: FC = (props) => {
  const { children } = props;
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <DocsLayoutRoot>
      <DocsNavbar onOpenSidebar={(): void => setIsSidebarOpen(true)} />
      <DocsSidebar
        onClose={(): void => setIsSidebarOpen(false)}
        open={isSidebarOpen}
      />
      {children}
    </DocsLayoutRoot>
  );
};
