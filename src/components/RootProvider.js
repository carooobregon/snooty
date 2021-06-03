import React from 'react';
import PropTypes from 'prop-types';
import { HeaderContextProvider } from './header-context';
import { NavigationProvider } from './navigation-context';
import { SidebarContextProvider } from './sidebar-context';
import { TabProvider } from './tab-context';

const RootProvider = ({ children, isSidebarEnabled, selectors }) => (
  <TabProvider selectors={selectors}>
    <HeaderContextProvider>
      <NavigationProvider>
        <SidebarContextProvider isSidebarEnabled={isSidebarEnabled}>{children}</SidebarContextProvider>
      </NavigationProvider>
    </HeaderContextProvider>
  </TabProvider>
);

RootProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  isSidebarEnabled: PropTypes.bool,
  selectors: PropTypes.object,
};

export default RootProvider;