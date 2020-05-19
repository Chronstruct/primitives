<>
{/* size expression identifier */}
<view grow={someVar}/>

{/* size member expression */}
<view grow={this.props.grow}/>

{/* size expression templateLiteral */}
<view height={`${someVar}px`}/>

{/* size expression conditionalExpression */}
<view grow={`${someVar ? true : false}`}/>

{/* size expression ALL_CAPS identifier */}
<view grow={ALL_CAPS}/>

{/* size expression ALL_CAPS templateLiteral */}
<view height={`${ALL_CAPS}px`}/>

{/* size expression ALL_CAPS conditionalExpression */}
<view grow={ALL_CAPS ? true : false}/>
</>