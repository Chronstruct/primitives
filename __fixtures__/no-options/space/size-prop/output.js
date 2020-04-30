<>
  {
    /* size string */
  }
  <div className={css`
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 10px;
`} />

  {
    /* size expression string */
  }
  <div className={css`
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 10px;
`} />

  {
    /* size expression identifier */
  }
  <div className={css`
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: ${someVar};
`} />

  {
    /* size expression templateLiteral */
  }
  <div className={css`
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: ${`${someVar}px`};
`} />

  {
    /* size expression conditionalExpression */
  }
  <div className={css`
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: ${`${someVar ? true : false}`};
`} />

  {
    /* size object */
  }
  <div className={css`
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 10px;

  @media screen and (min-width: 200px) {
    flex-basis: 200px;
  }
`} />
</>;