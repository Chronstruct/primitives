<>
{/* size string */}
<space size='10px'/>

{/* size expression string */}
<space size={'10px'}/>

{/* size expression identifier */}
<space size={someVar}/>

{/* size expression templateLiteral */}
<space size={`${someVar}px`}/>

{/* size expression conditionalExpression */}
<space size={`${someVar ? true : false}`}/>

{/* size object */}
<space size={{'': 10, '@media screen and (min-width: 200px)': 200}}/>
</>