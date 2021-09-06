<>
  {
    /* from -> to */
  }
  <div className={css`
  animation-delay: 3s;
  animation-duration: 300ms;
  animation-timing-function: ease;
  animation-fill-mode: both;
  animation-iteration-count: 2;
  animation-name: kf0;

  @keyframes kf0 {
    from {
      opacity: 0;
      visibility: hidden;
      transform: scale(0.8);
    }

    to {
      opacity: 1;
      visibility: visible;
      transform: scale(1);
    }
  }
`} />

  {
    /* percentage keyframes repeated */
  }
  <div className={css`
  animation-duration: 4s;
  animation-timing-function: ease-out;
  animation-iteration-count: infinite;
  animation-name: kf1;

  @keyframes kf1 {
    0% {
      color: ${BLACK};
    }

    20% {
      color: ${WHITE};
    }

    30% {
      color: ${WHITE};
    }

    70% {
      color: ${DARK};
    }

    100% {
      color: ${DARK};
    }
  }
`} />
</>;