import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { css } from 'linaria'

storiesOf('Button', module)
  .add('simple with onClick', () => (
    <view
    as="button"
    padding={16}
    onClick={action('button-click')}
    //_events={{
      //onClick: this.handleOpenFadeOverlay
    //}}
    style={{border: '1px solid #111'}}
  >
    <text size='16px'>
      Press Me
    </text>
  </view>
  ))