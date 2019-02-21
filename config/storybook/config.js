import React from 'react';

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

addDecorator(withKnobs);
// addDecorator((story, context) => withInfo('common info')(story)(context));

configure(loadStories, module);
