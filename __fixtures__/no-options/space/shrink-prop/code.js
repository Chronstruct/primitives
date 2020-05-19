<>
{/* boolean */}
<space shrink/>

{/* boolean expression */}
<space shrink={true}/>

{/* numeric expression */}
<space shrink={3}/>

{/* string NOT handled */}
<space shrink="NOT_HANDLED" />

{/* expression conditionalExpression */}
<space shrink={`${someVar ? true : false}`}/>

{/* object */}
<space shrink={{'': true, '@media screen and (min-width: 200px)': 200}}/>
</>