<>
  {
    /* size expression identifier */
  }
  <div className={css`
  display: flex;
  align-content: flex-start;
  position: relative;
`} style={{
    flexGrow: someVar
  }} />

  {
    /* size member expression */
  }
  <div className={css`
  display: flex;
  align-content: flex-start;
  position: relative;
`} style={{
    flexGrow: this.props.grow
  }} />

  {
    /* size expression templateLiteral */
  }
  <div className={css`
  display: flex;
  align-content: flex-start;
  position: relative;
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
  flex-grow: ${ALL_CAPS};
`} />

  {
    /* size expression ALL_CAPS templateLiteral */
  }
  <div className={css`
  display: flex;
  align-content: flex-start;
  position: relative;
  height: ${`${ALL_CAPS}px`};
`} />

  {
    /* size expression ALL_CAPS conditionalExpression */
  }
  <div className={css`
  display: flex;
  align-content: flex-start;
  position: relative;
  flex-grow: ${ALL_CAPS ? true : false};
`} />
</>;