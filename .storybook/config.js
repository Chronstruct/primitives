import { configure } from '@storybook/react';

function loadStories() {
  require('../__stories__/view.js');
  require('../__stories__/space.js');
  require('../__stories__/text.js');
  require('../__stories__/button.js');
  // You can require as many stories as you need.
}

configure(loadStories, module);