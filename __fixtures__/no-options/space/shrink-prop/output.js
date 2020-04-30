<>
  {
    /* boolean */
  }
  <div className={css`
  flex-grow: 0;
  flex-shrink: 1;
`} />

  {
    /* boolean expression */
  }
  <div className={css`
  flex-grow: 0;
  flex-shrink: 1;
`} />

  {
    /* numeric expression */
  }
  <div className={css`
  flex-grow: 0;
  flex-shrink: 3;
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
  flex-shrink: ${`${someVar ? true : false}`};
`} />

  {
    /* object */
  }
  <div className={css`
  flex-grow: 0;
  flex-shrink: 1;

  @media screen and (min-width: 200px) {
    flex-shrink: 200;
  }
`} />
</>;