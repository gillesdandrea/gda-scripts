import React from 'react';

import { configureViewport, INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { withKnobs } from '@storybook/addon-knobs';
import { withOptions } from '@storybook/addon-options';
import { addDecorator, configure } from '@storybook/react';

addDecorator(
  withOptions({
    name: `${NAME}@${VERSION}`, // eslint-disable-line no-undef
    url: REPOSITORY, // eslint-disable-line no-undef
    hierarchySeparator: /\/|\./,
    hierarchyRootSeparator: /\|/,
  })
);
addDecorator(withKnobs);
// addDecorator((story, context) => withInfo('common info')(story)(context));
configureViewport({
  viewports: {
    // ...INITIAL_VIEWPORTS,
    mx: { name: 'View Max', styles: { width: '1584px', height: '100%' } },
    xl: { name: 'View XL (1312px)', styles: { width: '1312px', height: '100%' } },
    lg: { name: 'View L (1056px)', styles: { width: '1056px', height: '100%' } },
    md: { name: 'View M (672px)', styles: { width: '672px', height: '100%' } },
    sm: { name: 'View S (320px)', styles: { width: '320px', height: '100%' } },
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
