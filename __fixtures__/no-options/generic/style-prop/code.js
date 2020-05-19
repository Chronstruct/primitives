<>
{/* style by itself */}
<view style={{backgroundColor: 'red', top: 0}} />

{/* style with object config */}
<view style={{backgroundColor: {'': 'red', 'hover': 'green'}}} />

{/* style with other props */}
<view top={20} style={{backgroundColor: 'red'}} />

{/* top collision: style object's top wins, but should it? */}
<view top={20} style={{backgroundColor: 'red', top: 0}} />
</>