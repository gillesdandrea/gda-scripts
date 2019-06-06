import { storiesOf } from '@storybook/html'; // eslint-disable-line import/no-extraneous-dependencies

import Add from './Add';

const adder = new Add(2);

storiesOf('add', module).add('default', () => `<div>2*(2+2)=${adder.add(2, 2)}</div>`);
