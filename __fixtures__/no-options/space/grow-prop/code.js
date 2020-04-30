<>
{/* boolean */}
<space grow/>

{/* boolean expression */}
<space grow={true}/>

{/* numeric expression */}
<space grow={3}/>

{/* string NOT handled */}
<space grow="NOT_HANDLED" />

{/* expression conditionalExpression */}
<space grow={`${someVar ? true : false}`}/>

{/* object */}
<space grow={{'': true, '@media screen and (min-width: 200px)': 200}}/>
</>