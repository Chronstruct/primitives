<>
  {
    /* boolean */
  }
  <div className={css`
  flex-grow: 1;
  flex-shrink: 0;
`} />

  {
    /* boolean expression */
  }
  <div className={css`
  flex-grow: 1;
  flex-shrink: 0;
`} />

  {
    /* numeric expression */
  }
  <div className={css`
  flex-grow: 3;
  flex-shrink: 0;
`} />

  {
    /* string NOT handled */
  }
  <div className={css`
  flex-grow: 0;
  flex-shrink: 0;
`} />

  {
    /* expression conditionalExpression */
  }
  <div className={css`
  flex-grow: 0;
  flex-shrink: 0;
`} style={{
    flexGrow: `${someVar ? true : false}`
  }} />

  {
    /* object */
  }
  <div className={css`
  flex-grow: 1;
  flex-shrink: 0;

  @media screen and (min-width: 200px) {
    flex-grow: 200;
  }
`} />
</>;