<div className={css`
  @media screen and (min-width: 400px) {
    min-width: 400px;
  }
  display: flex;
  align-content: flex-start;
  position: relative;
  min-height: 20px;

  hover {
    min-height: 20px;
    flex-shrink: 2;
  }
  min-width: 40px;
  max-width: 200px;

  ${someVar} {
    max-width: 2000px;
  }
  flex-shrink: 1;
`} />;