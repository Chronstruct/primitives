<>
  {
    /* size expression identifier */
  }
  <div className={css`
  display: flex;
  align-content: flex-start;
  position: relative;
  flex-shrink: 0;
`} style={{
    flexGrow: someVar
  }} />

  {
    /* size expression templateLiteral */
  }
  <div className={css`
  display: flex;
  align-content: flex-start;
  position: relative;
  flex-shrink: 0;
`} style={{
    height: `${someVar}px`
  }} />

  {
    /* size expression conditionalExpression */
  }
  <div className={css`
  display: flex;
  align-content: flex-start;
  position: relative;
  flex-shrink: 0;
`} style={{
    flexGrow: `${someVar ? true : false}`
  }} />

  {
    /* size expression ALL_CAPS identifier */
  }
  <div className={css`
  display: flex;
  align-content: flex-start;
  position: relative;
  flex-shrink: 0;
  flex-grow: ${ALL_CAPS};
`} />

  {
    /* size expression ALL_CAPS templateLiteral */
  }
  <div className={css`
  display: flex;
  align-content: flex-start;
  position: relative;
  flex-shrink: 0;
  height: ${`${ALL_CAPS}px`};
`} />

  {
    /* size expression ALL_CAPS conditionalExpression */
  }
  <div className={css`
  display: flex;
  align-content: flex-start;
  position: relative;
  flex-shrink: 0;
  flex-grow: ${ALL_CAPS ? true : false};
`} />
</>;