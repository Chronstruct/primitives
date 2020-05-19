<>
{/* from -> to */}
<view
  _animate={{
    delay: "3s",
    duration: "300ms",
    easing: "ease",
    persist: "both",
    repeat: 2,
    keyframes: {
      from: {
        opacity: 0,
        visibility: "hidden",
        transform: "scale(0.8)",
      },
      to: {
        opacity: 1,
        visibility: "visible",
        transform: "scale(1)",
      },
    },
  }}
/>

{/* percentage keyframes repeated */}
<view 
  _animate={{
    duration: "4s",
    easing: "ease-out",
    repeat: true,
    keyframes: {
      "0%": {
        color: BLACK,
      },
      "20%": {
        color: WHITE,
      },
      "30%": {
        color: WHITE,
      },
      "70%": {
        color: DARK,
      },
      "100%": {
        color: DARK,
      },
    },
  }}
/>
</>