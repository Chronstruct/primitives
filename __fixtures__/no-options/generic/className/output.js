<>
  <div className={`b__e--m ${css`
  display: flex;
  align-content: flex-start;
  position: relative;
  flex-shrink: 0;
`}`} />

  <div className={`someString ${css`
  display: flex;
  align-content: flex-start;
  position: relative;
  flex-shrink: 0;
`}`} />

  <div className={`${someVar} ${css`
  display: flex;
  align-content: flex-start;
  position: relative;
  flex-shrink: 0;
`}`} />

  <div className={`${cx("someString", someBool && "someOtherString")} ${css`
  display: flex;
  align-content: flex-start;
  position: relative;
  flex-shrink: 0;
`}`} />
</>;