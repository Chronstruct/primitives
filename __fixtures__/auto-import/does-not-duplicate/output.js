import { css } from "linaria";

const something = () => (
  <div
    className={css`
      display: flex;
      align-content: flex-start;
      position: relative;
      flex-shrink: 0;
    `}
  />
);