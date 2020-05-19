<>
  {
    /* does NOT handle spread props */
  }
  <div className={css`
  display: flex;
  align-content: flex-start;
  position: relative;
  flex-shrink: 0;
`} />

  {
    /* does NOT handle spread props of variable */
  }
  <div className={css`
  display: flex;
  align-content: flex-start;
  position: relative;
  flex-shrink: 0;
`} />

  {
    /* handles spread of empty props */
  }
  <div className={css`
  display: flex;
  align-content: flex-start;
  position: relative;
  flex-shrink: 0;
`} />
</>;