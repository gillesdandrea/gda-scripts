import React from 'react';

import { text } from '@storybook/addon-knobs'; // eslint-disable-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies

import Hello from './Hello';

storiesOf('Components|Hello', module).add('default', () => <Hello name={text('NAME', 'World')} />);
