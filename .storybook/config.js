import { configure } from '@storybook/react';

function loadStories() {
  require('../stories/view.js');
  require('../stories/space.js');
  require('../stories/text.js');
  require('../stories/button.js');
  // You can require as many stories as you need.
}

configure(loadStories, module);