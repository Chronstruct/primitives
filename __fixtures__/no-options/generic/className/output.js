<>
  <div className={`b__e--m ${css`
`}`} />

  <div className={`someString ${css`
`}`} />

  <div className={`${someVar} ${css`
`}`} />

  <div className={`${cx("someString", someBool && "someOtherString")} ${css`
`}`} />
</>;