import React from "react"
import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import { css } from "linaria"

export const DISPLAY_FONT = "'Times', sans-serif"
export const TEXT_FONT = "sans-serif"

export const DISPLAY_SIZE = "40px"
export const TEXT_SIZE = "18px"
export const LINK_SIZE = "16px"

export const BLACK = "#000"
export const WHITE = "#fff"
export const DARK = "#111"
export const GREY = "#888"

// const AnimateConfig = () => (
//   <box
//     style={{
//       opacity: 0,
//       visibility: "hidden",
//       transform: "scale(0.8)",
//     }}
//     animate={{
//       duration: "300ms",
//       easing: "ease",
//       delay: "3s",
//       after: "persist",
//       keyframes: {
//         to: {
//           opacity: 1,
//           visibility: "visible",
//           transform: "scale(1)",
//         },
//       },
//     }}
//     className={css`
//       opacity: 0;
//       visibility: hidden;
//       transform: scale(0.8);

//       animation: in 300ms ease 3s forwards;
//       @keyframes in {
//         to {
//           opacity: 1;
//           visibility: visible;
//           transform: scale(1);
//         }
//       }
//     `}
//   ></box>
// )

const Link = ({ text, to }) => {
  const [isHovering, setIsHovering] = React.useState(false)

  return (
    <box
      tag="a"
      tag-href={to}
      padding="4px 8px"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <txt
        font={DISPLAY_FONT}
        size={LINK_SIZE}
        transform="uppercase"
        inlineStyle={{
          color: isHovering ? DARK : GREY,
          transition: isHovering ? "none" : "color 400ms ease",
        }}
      >
        {text}
      </txt>
    </box>
  )
}

// const FutureLink = ({ text, to }) => {
//   const [isHovering, setIsHovering] = React.useState(false)

//   return (
//     <box
//       padding="4px 8px"
//       tag="a"
//       tag-href={to}
//       events={{
//         mouseEnter: () => setIsHovering(true),
//         mouseLeave: () => setIsHovering(false),
//       }}
//     >
//       <txt
//         font={DISPLAY_FONT}
//         size={LINK_SIZE}
//         transform="uppercase"
//         decoration="none"
//         color={{
//           "": "red",
//           transition: {
//             to: "blue",
//             timing: ["300ms ease 3s", "none"],
//             trigger: isHovering,
//           },
//         }}
//       >
//         {text}
//       </txt>
//     </box>
//   )
// }

// const PossibleFutureLink = ({ text, to }) => {
//   const [isHovering, setIsHovering] = React.useState(false)

//   return (
//     <interact_
//       onMouseEnter={() => setIsHovering(true)}
//       onMouseLeave={() => setIsHovering(false)}
//     >
//       <box
//         tag="a"
//         tag-href={to}
//         padding="4px 8px"
//       >
//         <txt
//           font={DISPLAY_FONT}
//           size={LINK_SIZE}
//           transform="uppercase"
//           decoration="none"
//           color={{
//             "": "red",
//             transition: {
//               to: "blue",
//               timing: ["300ms ease 3s", "none"],
//               trigger: isHovering,
//             },
//           }}
//         >
//           {text}
//         </txt>
//       </box>
//     </interact_>
//   )
// }

// const Button = () => {
//   const [isHovering, setIsHovering] = React.useState(false)

//   return (
//     <box
//       tag="a"
//       tag-href="mailto:kyle@chronstruct.com"
//       paddingVertical={16}
//       paddingHorizontal={32}
//       event={{
//         mouseEnter: () => setIsHovering(true),
//         mouseLeave: () => setIsHovering(false),
//       }}
//       style={{
//         border: `2px solid ${BLACK}`,
//         borderRadius: 8,
//         transition: {
//           _dynamic: isHovering ? "background-color 400ms ease" : "none",
//           // $: isHovering ? "background-color 400ms ease" : "none",
//         },
//         backgroundColor: {
//           _dynamic: isHovering ? WHITE : BLACK,
//         },

//         // Since they were just _dynamic, you could leave the object out of it
//         // transition: isHovering ? "background-color 400ms ease" : "none",
//         // backgroundColor: isHovering ? WHITE : BLACK
//       }}
//     >
//       <txt
//         selectable={false}
//         font={TEXT_FONT}
//         size={TEXT_SIZE}
//         color={{ _dynamic: isHovering ? DARK : WHITE }}
//         style={{
//           transition: "color 400ms ease",
//         }}
//       >
//         Now available for hire!
//       </txt>
//     </box>
//   )
// }

// const FutureButton = () => {
//   const [isHovering, setIsHovering] = React.useState(false)

//   return (
//     <box
//       tag="a"
//       tag-href="mailto:kyle@chronstruct.com"
//       paddingVertical={16}
//       paddingHorizontal={32}
//       event={{
//         mouseEnter: () => setIsHovering(true),
//         mouseLeave: () => setIsHovering(false),
//       }}
//       style={{
//         border: `2px solid ${BLACK}`,
//         borderRadius: 8,
//         backgroundColor: {
//           _: BLACK,
//           _transition: {
//             to: WHITE,
//             timing: ["300ms ease 3s", "none"],
//             trigger: isHovering,
//           },
//         },
//       }}
//     >
//       <txt
//         selectable={false} // user-select: none;
//         font={TEXT_FONT}
//         size={TEXT_SIZE}
//         color={{
//           _: WHITE,
//           _transition: {
//             to: WHITE,
//             timing: "300ms ease 3s",
//             trigger: isHovering,
//           },
//         }}
//       >
//         Now available for hire!
//       </txt>
//     </box>
//   )
// }

// const AltFutureButton = () => {
//   const [isHovering, setIsHovering] = React.useState(false)

//   return (
//     <box
//       tag="a"
//       tag-href="mailto:kyle@chronstruct.com"
//       paddingVertical={16}
//       paddingHorizontal={32}
//       event={{
//         mouseEnter: () => setIsHovering(true),
//         mouseLeave: () => setIsHovering(false),
//       }}
//       style={{
//         border: `2px solid ${BLACK}`,
//         borderRadius: 8,
//         backgroundColor: [
//           BLACK,
//           {
//             _transition: {
//               to: WHITE,
//               timing: ["300ms ease 3s", "none"],
//               trigger: isHovering,
//             },
//           },
//         ],
//       }}
//     >
//       <txt
//         selectable={false} // user-select: none;
//         font={TEXT_FONT}
//         size={TEXT_SIZE}
//         color={[
//           WHITE,
//           {
//             _transition: {
//               to: WHITE,
//               timing: "300ms ease 3s",
//               trigger: isHovering,
//             },
//           },
//         ]}
//       >
//         Now available for hire!
//       </txt>
//     </box>
//   )
// }

// const PotentialFutureButton = () => {
//   const [isHovering, setIsHovering] = React.useState(false)

//   return (
//     <box
//       tag="a"
//       tag-href="mailto:kyle@chronstruct.com"
//       paddingVertical={16}
//       paddingHorizontal={32}
//       event={{
//         mouseEnter: () => setIsHovering(true),
//         mouseLeave: () => setIsHovering(false),
//       }}
//       style={`
//         border: 2px solid ${BLACK};
//         border-radius: 8;
//         background-color: {
//           BLACK;

//           @transition: {
//             to: WHITE,
//             timing: ["300ms ease 3s", "none"],
//             trigger: isHovering,
//           }
//         }
//       `}
//     >
//       <txt
//         selectable={false} // user-select: none;
//         font={TEXT_FONT}
//         size={TEXT_SIZE}
//         color={`
//           ${WHITE};

//           @transition: {
//             to: ${WHITE};
//             timing: 300ms ease 3s;
//             trigger: ${isHovering};
//           }
//         `}
//       >
//         Now available for hire!
//       </txt>
//     </box>
//   )
// }

storiesOf("Composite Components", module)
  .add("simple link", () => (
    <box
      as="a"
      href="/to-somewhere"
      padding="4px 8px"
    >
      <txt
        font={DISPLAY_FONT}
        size={LINK_SIZE}
        transform="uppercase"
      >
        simple link
      </txt>
    </box>
  ))
  .add("link with hover effect", () => (
    <Link
      text="link with hover effect"
      to="/somewhere"
    />
  ))
