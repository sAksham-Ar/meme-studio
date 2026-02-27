import { styled } from '@styled-system/jsx'

export const ImageOverlayBox = styled('div', {
  base: {
    position: 'absolute',
    zIndex: 2,
    cursor: 'move',
    bgColor: 'transparent',
    '--color-widget': 'rgba(14, 42, 71, 0.6)',
    border: '0.0625rem dotted var(--color-widget)',
    transformOrigin: 'center center',
    userSelect: 'none',
    // Handles hidden by default; shown on hover, selection, or active gesture
    '& [data-overlay-handle]': {
      opacity: 0,
      pointerEvents: 'none',
      transition: 'opacity 0.1s'
    },
    "&:hover [data-overlay-handle], &[aria-selected='true'] [data-overlay-handle], &[data-active] [data-overlay-handle]":
      {
        opacity: 1,
        pointerEvents: 'auto'
      },
    "&:hover [data-overlay-handle], &[aria-selected='true'] [data-overlay-handle]":
      {
        opacity: 1,
        pointerEvents: 'auto'
      },
    "&[aria-selected='true']": {
      '--color-widget': 'rgb(48, 91, 161)'
    }
  }
})

export const ImageOverlayImg = styled('img', {
  base: {
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    pointerEvents: 'none',
    userSelect: 'none'
  }
})

export const OverlayResizeHandle = styled('div', {
  base: {
    position: 'absolute',
    w: '1.125rem',
    h: '1.125rem',
    borderRadius: '50%',
    zIndex: 3,
    transform: 'translate(-50%, -50%)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'white',
    bg: 'var(--color-widget)',
    "&[data-side='se']": {
      cursor: 'nwse-resize',
      top: '100%',
      left: '100%'
    },
    "&[data-side='sw']": {
      cursor: 'nesw-resize',
      top: '100%',
      left: 0
    },
    "&[data-side='ne']": {
      cursor: 'nesw-resize',
      top: 0,
      left: '100%'
    },
    "&[data-side='nw']": {
      cursor: 'nwse-resize',
      top: 0,
      left: 0
    }
  }
})

export const OverlayRotateHandle = styled('div', {
  base: {
    h: '1.25rem',
    cursor: 'grab',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bg: 'var(--color-widget)',
    position: 'absolute',
    top: 'calc(100% + 1rem)',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'rgba(255, 255, 255, 0.6)',
    padding: '0.3rem',
    borderRadius: '0.3rem',
    borderWidth: '0.0625rem',
    borderStyle: 'solid',
    borderColor: 'white'
  }
})

export const OverlayDeleteHandle = styled('button', {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bg: 'red',
    color: 'white',
    position: 'absolute',
    top: 0,
    right: '100%',
    w: '1.25rem',
    h: '1.25rem',
    transform: 'translate(50%, -50%)',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '0.6rem',
    borderWidth: 0,
    zIndex: 4
  }
})
