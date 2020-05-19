<>
{/* does NOT handle spread props */}
<flex {...{width:variable,height:'20px'}}/>

{/* does NOT handle spread props of variable */}
<flex {...someVar}/>

{/* handles spread of empty props */}
<flex {...{}}/>
</>