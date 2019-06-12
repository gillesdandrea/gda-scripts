import '@babel/polyfill';
import React from 'react';

import { withKnobs } from '@storybook/addon-knobs/react';
// import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { addDecorator, addParameters, configure } from '@storybook/react';
import { create } from '@storybook/theming';
// import { addReadme } from 'storybook-readme/html';

// addDecorator(addReadme);
addDecorator(withKnobs);

addParameters({
  options: {
    theme: create({
      base: 'light',
      brandTitle: `${NAME}@${VERSION}`, // eslint-disable-line no-undef
      brandUrl: REPOSITORY, // eslint-disable-line no-undef
      // brandImage: 'https://storybook.js.org/images/logos/logo-storybook.svg',
    }),
    isFullScreen: false,
    panelPosition: 'bottom',
    showNav: true,
    showPanel: true,
    sortStoriesByKind: false,
    hierarchySeparator: /\//,
    hierarchyRootSeparator: /\|/,
  },
  // readme: {
  //   codeTheme: 'github',
  // },
});

addParameters({
  viewport: {
    viewports: {
      // ...INITIAL_VIEWPORTS,
      mx: { name: 'View Max', styles: { width: '1584px', height: 'calc(100% - 40px)' } },
      xl: { name: 'View XL', styles: { width: '1312px', height: 'calc(100% - 40px)' } },
      lg: { name: 'View L', styles: { width: '1056px', height: 'calc(100% - 40px)' } },
      md: { name: 'View M', styles: { width: '672px', height: 'calc(100% - 40px)' } },
      sm: { name: 'View S', styles: { width: '320px', height: 'calc(100% - 40px)' } },
    },
  },
});

const configs = require.context('STORIES', true, /storybook\/StoryContainer.jsx?$/);
configs.keys().forEach(filename => {
  const StoryContainer = configs(filename).default;
  // <StoryContainer story={story} componentContext={componentContext} />
  addDecorator((story, componentContext) => React.createElement(StoryContainer, { story, componentContext }));
});

function loadStories() {
  // require('../stories');
  const req = require.context('STORIES', true, /[.-]stor(y|ies)\.jsx?$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
