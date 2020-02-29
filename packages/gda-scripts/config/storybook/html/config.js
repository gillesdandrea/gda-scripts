import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { withKnobs } from '@storybook/addon-knobs/html';
// import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { addDecorator, addParameters, configure } from '@storybook/html';
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
      mx: { name: 'View Max', styles: { width: '1584px', height: '100%' } },
      xl: { name: 'View XL', styles: { width: '1312px', height: '100%' } },
      lg: { name: 'View L', styles: { width: '1056px', height: '100%' } },
      md: { name: 'View M', styles: { width: '672px', height: '100%' } },
      sm: { name: 'View S', styles: { width: '320px', height: '100%' } },
    },
  },
});

// const configs = require.context('STORIES', true, /storybook\/StoryContainer.jsx?$/);
// configs.keys().forEach(filename => {
//   const StoryContainer = configs(filename).default;
//   // <StoryContainer story={story} componentContext={componentContext} />
//   addDecorator((story, componentContext) => React.createElement(StoryContainer, { story, componentContext }));
// });

function loadStories() {
  // require('../stories');
  const req = require.context('STORIES', true, /[.-]stor(y|ies)\.jsx?$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
