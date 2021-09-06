<>
{/* style by itself */}
<generic style={{backgroundColor: 'red', top: 0}} />

{/* style with object config */}
<generic style={{backgroundColor: {'': 'red', 'hover': 'green'}}} />

{/* style with other props */}
<generic top={20} style={{backgroundColor: 'red'}} />

{/* top collision: style object's top wins, but should it? */}
<generic top={20} style={{backgroundColor: 'red', top: 0}} />
</>