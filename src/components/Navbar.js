import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { withPrefix } from 'gatsby';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import useMedia from '../hooks/use-media';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { isBrowser } from '../utils/is-browser';
import { getSearchbarResultsFromJSON } from '../utils/get-searchbar-results-from-json';
import { searchParamsToURL } from '../utils/search-params-to-url';
import { URL_SLUGS } from '../constants';
import Searchbar from './Searchbar';
import ConditionalWrapper from './ConditionalWrapper';
import { UnifiedNav } from '@mdb/consistent-nav';
import { theme } from '../theme/docsTheme';

const getActiveSection = (slug, urlItems) => {
  const urlMapping = Object.entries(urlItems).find(([, value]) => value.includes(slug));
  if (urlMapping) {
    return urlMapping[0];
  }

  if (isBrowser) {
    switch (window.location.pathname) {
      case 'tools':
        return 'tools';
      case 'cloud':
        return 'cloud';
      default:
        return null;
    }
  }

  return null;
};

const NavbarContainer = styled('div')`
  ${({ isExpanded, shouldOpaqueWhenExpanded }) => isExpanded && shouldOpaqueWhenExpanded && 'opacity: 0.2;'};

  ${theme.bannerContent.enabled
    ? `top: unset !important;

  & > nav {
    top: unset !important;
  }`
    : ''}

  .navbar-brand {
    width: 90px;
  }
`;

const Navbar = () => {
  const { project } = useSiteMetadata();

  const unifiedNavProperty = project === 'realm' ? 'REALM' : 'DOCS';

  const [activeLink, setActiveLink] = useState('');
  // We want to expand the searchbar on default when it won't collide with any other nav elements
  // Specifically, the upper limit works around the Get MongoDB link
  const isSearchbarDefaultExpanded = useMedia(
    'only screen and (min-width: 670px) and (max-width: 1200px), (min-width: 1300px)'
  );
  const isActiveLink = useCallback((link) => link.toLowerCase() === activeLink, [activeLink]);
  const [isSearchbarExpanded, setIsSearchbarExpanded] = useState(isSearchbarDefaultExpanded);
  const modifyActiveLink = useMemo(
    () =>
      `{"links": [
        {"url": "https://docs.mongodb.com/manual/","text": "Server", "active": ${isActiveLink('Server')}},
        {"url": "https://docs.mongodb.com/drivers/","text": "Drivers", "active": ${isActiveLink('Drivers')}},
        {"url": "https://docs.mongodb.com/cloud/","text": "Cloud", "active": ${isActiveLink('Cloud')}},
        {"url": "https://docs.mongodb.com/tools/","text": "Tools", "active": ${isActiveLink('Tools')}},
        {"url": "https://docs.mongodb.com/guides/","text": "Guides", "active": ${isActiveLink('Guides')}}
      ]}`,
    [isActiveLink]
  );
  const [navprops, setNavprops] = useState(modifyActiveLink);

  const onSearchbarExpand = useCallback(
    (isExpanded) => {
      // On certain screens the searchbar is never collapsed
      if (!isSearchbarDefaultExpanded) {
        setIsSearchbarExpanded(isExpanded);
      }
    },
    [isSearchbarDefaultExpanded]
  );

  useEffect(() => {
    // Add script to give navbar functionality and css
    const script = document.createElement('script');
    script.src = withPrefix('docs-tools/navbar.min.js');
    script.async = true;

    document.body.appendChild(script);

    setActiveLink(getActiveSection(project, URL_SLUGS));
  }, [project]);

  useEffect(() => {
    setNavprops(modifyActiveLink);
  }, [activeLink, modifyActiveLink]);

  useEffect(() => {
    setIsSearchbarExpanded(isSearchbarDefaultExpanded);
  }, [isSearchbarDefaultExpanded]);

  return (
    <>
      {process.env.GATSBY_FEATURE_FLAG_CONSISTENT_NAVIGATION ? (
        <div
          css={css`
            position: fixed;
            top: 0;
            width: 100%;
            z-index: 2;
          `}
        >
          <UnifiedNav property={unifiedNavProperty} />
        </div>
      ) : (
        <ConditionalWrapper
          condition={true}
          wrapper={(children) => (
            <div
              css={css`
                position: fixed;
                top: 0;
              `}
            >
              {children}
            </div>
          )}
        >
          <NavbarContainer
            isExpanded={isSearchbarExpanded}
            shouldOpaqueWhenExpanded={!isSearchbarDefaultExpanded}
            tabIndex="0"
            id="navbar"
            className="navbar"
            data-navprops={navprops}
          />
          <Searchbar
            getResultsFromJSON={getSearchbarResultsFromJSON}
            isExpanded={isSearchbarExpanded}
            setIsExpanded={onSearchbarExpand}
            searchParamsToURL={searchParamsToURL}
            // Autofocus the searchbar when the user expands only so the user can start typing
            shouldAutofocus={!isSearchbarDefaultExpanded}
          />
        </ConditionalWrapper>
      )}
    </>
  );
};

export default Navbar;
