<>
  {
    /* style by itself */
  }
  <div className={css`
  display: flex;
  align-content: flex-start;
  position: relative;
  flex-shrink: 0;
  background-color: red;
  top: 0px;
`} />

  {
    /* style with object config */
  }
  <div className={css`
  display: flex;
  align-content: flex-start;
  position: relative;
  flex-shrink: 0;
  background-color: red;

  hover {
    background-color: green;
  }
`} />

  {
    /* style with other props */
  }
  <div className={css`
  display: flex;
  align-content: flex-start;
  position: relative;
  flex-shrink: 0;
  top: 20px;
  background-color: red;
`} />

  {
    /* top collision: style object's top wins, but should it? */
  }
  <div className={css`
  display: flex;
  align-content: flex-start;
  position: relative;
  flex-shrink: 0;
  top: 0px;
  background-color: red;
`} />
</>;