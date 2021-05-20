import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@leafygreen-ui/emotion';
import { uiColors } from '@leafygreen-ui/palette';
import { normalizePath } from '../utils/normalize-path';
import { theme } from '../theme/docsTheme';
import ComponentFactory from './ComponentFactory';
import Link from './Link';

const cardRefStyling = css`
  background: ${uiColors.gray.light3};
  border-radius: ${theme.size.tiny};
  border: 1px solid rgba(184, 196, 194, 0.48);
  box-sizing: border-box;
  display: inline-block;
  font-size: ${theme.fontSize.small};
  font-weight: 600;
  margin-bottom: ${theme.size.small};
  margin-right: ${theme.size.small};
  padding: ${theme.size.tiny};

  &:after {
    content: ' ➔';
  }
`;

const RefRole = ({ nodeData: { children, fileid, url }, slug }) => {
  // Render intersphinx target links
  if (url) {
    return (
      <Link to={url}>
        {children.map((node, i) => (
          <ComponentFactory key={i} nodeData={node} />
        ))}
      </Link>
    );
  }

  // Render internal target and page links
  let link = '';
  if (fileid) {
    let [filename, html_id] = fileid;
    if (filename === 'index') filename = '/';

    if (filename === slug) {
      // Internal page link
      link = `#${html_id}`;
    } else if (html_id === '') {
      // :doc: link
      link = filename;
    } else {
      link = `${filename}/#${html_id}`;
    }
  }

  return (
    // className={cx(cardRefStyling)}
    <Link to={normalizePath(link)}>
      {children.map((node, i) => (
        <ComponentFactory key={i} nodeData={node} />
      ))}
    </Link>
  );
};

RefRole.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
    domain: PropTypes.string.isRequired,
    fileid: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string.isRequired,
    url: PropTypes.string,
  }).isRequired,
  slug: PropTypes.string.isRequired,
};

export default RefRole;
