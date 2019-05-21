import { storiesOf } from '@storybook/html'; // eslint-disable-line import/no-extraneous-dependencies

import add from './add';

storiesOf('add', module).add('default', () => `<div>2+2=${add(2, 2)}</div>`);
