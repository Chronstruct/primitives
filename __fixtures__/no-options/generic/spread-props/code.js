<>
{/* does NOT handle spread props */}
<generic {...{width:variable,height:'20px'}}/>

{/* does NOT handle spread props of variable */}
<generic {...someVar}/>

{/* handles spread of empty props */}
<generic {...{}}/>
</>