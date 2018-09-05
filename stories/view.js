import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { css } from 'linaria'

storiesOf('view', module)
  .add('as nav', () => (
    <view
          as='nav'
          width='300px'
          height='30px'
          margin='20px'
          style={{
            backgroundColor: 'purple'
          }}
        />
  ))
  .add('with hove and media queries', () => (
        <view
          width={300}
          height={{
            '': 30,
            600: 400,
          }}
          margin={20}
          style={{
            backgroundColor: {
              '': 'purple',
              600: 'blue',
              ':hover': 'green',
            }
          }}
        />  
    ))