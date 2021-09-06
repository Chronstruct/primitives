<>
  {
    /* style by itself */
  }
  <div className={css`
  background-color: red;
  top: 0px;
`} />

  {
    /* style with object config */
  }
  <div className={css`
  background-color: red;

  hover {
    background-color: green;
  }
`} />

  {
    /* style with other props */
  }
  <div top={20} className={css`
  background-color: red;
`} />

  {
    /* top collision: style object's top wins, but should it? */
  }
  <div top={20} className={css`
  background-color: red;
  top: 0px;
`} />
</>;