"use client";

import React from "react";
import { css } from "@styled-system/css";
import { faRotateLeft, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ImageOverlayItem } from "@stores/ImageOverlay/ImageOverlay.store";
import {
  ImageOverlayBox,
  ImageOverlayImg,
  OverlayDeleteHandle,
  OverlayResizeHandle,
  OverlayRotateHandle,
} from "./ImageOverlay.styles";

const DRAG_THRESHOLD = 4; // px — movement below this is treated as a click

export type ImageOverlayDraggableProps = {
  item: ImageOverlayItem;
  canvasWidth: number;
  canvasHeight: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, patch: Partial<Omit<ImageOverlayItem, "id">>) => void;
  onDelete: (id: string) => void;
};

const ImageOverlayDraggable = ({
  item,
  canvasWidth,
  canvasHeight,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
}: ImageOverlayDraggableProps) => {
  const boxRef = React.useRef<HTMLDivElement>(null);

  const isDragging = React.useRef(false);
  const dragDidMove = React.useRef(false);
  const isResizing = React.useRef(false);
  const isRotating = React.useRef(false);
  const dragStart = React.useRef({ mouseX: 0, mouseY: 0, cx: 0, cy: 0 });
  const resizeStart = React.useRef({
    mouseX: 0,
    mouseY: 0,
    w: 0,
    h: 0,
    cx: 0,
    cy: 0,
    side: "",
  });
  const rotateStart = React.useRef({ mouseX: 0, mouseY: 0, startAngle: 0 });

  const setActive = (active: boolean) => {
    if (active) boxRef.current?.setAttribute("data-active", "");
    else boxRef.current?.removeAttribute("data-active");
  };

  // --- Drag ---
  const onMouseDownDrag = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).dataset.handle) return;
    e.stopPropagation();

    dragDidMove.current = false;
    setActive(true);
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      cx: item.centerX,
      cy: item.centerY,
    };

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - dragStart.current.mouseX;
      const dy = ev.clientY - dragStart.current.mouseY;

      if (!dragDidMove.current) {
        if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD)
          return;
        dragDidMove.current = true;
        isDragging.current = true;
        onSelect(item.id);
      }

      const cw = canvasWidth || Infinity;
      const ch = canvasHeight || Infinity;
      const newCx = Math.max(0, Math.min(cw, dragStart.current.cx + dx));
      const newCy = Math.max(0, Math.min(ch, dragStart.current.cy + dy));
      onUpdate(item.id, { centerX: newCx, centerY: newCy });
    };

    const onUp = () => {
      if (!dragDidMove.current) {
        onSelect(item.id);
      }
      isDragging.current = false;
      dragDidMove.current = false;
      setActive(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // --- Resize ---
  const onMouseDownResize = (side: string) => {
    return (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      isResizing.current = true;
      setActive(true);
      resizeStart.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        w: item.width,
        h: item.height,
        cx: item.centerX,
        cy: item.centerY,
        side,
      };

      const onMove = (ev: MouseEvent) => {
        if (!isResizing.current) return;
        const dx = ev.clientX - resizeStart.current.mouseX;
        const dy = ev.clientY - resizeStart.current.mouseY;
        const { side: s, w, h } = resizeStart.current;

        let delta: number;
        if (s === "se") delta = Math.max(dx, dy);
        else if (s === "sw") delta = Math.max(-dx, dy);
        else if (s === "ne") delta = Math.max(dx, -dy);
        else delta = Math.max(-dx, -dy); // nw

        const newW = Math.max(20, w + delta);
        const ratio = h / w;
        const newH = Math.max(20, newW * ratio);
        onUpdate(item.id, { width: newW, height: newH });
      };

      const onUp = () => {
        isResizing.current = false;
        setActive(false);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    };
  };

  // --- Rotate ---
  const onMouseDownRotate = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    isRotating.current = true;
    setActive(true);
    rotateStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startAngle: item.rotate,
    };

    const onMove = (ev: MouseEvent) => {
      if (!isRotating.current) return;
      const dx = ev.clientX - rotateStart.current.mouseX;
      const newAngle = rotateStart.current.startAngle + dx * 0.5;
      onUpdate(item.id, { rotate: newAngle });
    };

    const onUp = () => {
      isRotating.current = false;
      setActive(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const left = item.centerX - item.width / 2;
  const top = item.centerY - item.height / 2;

  return (
    <ImageOverlayBox
      ref={boxRef}
      aria-selected={isSelected}
      style={{
        left,
        top,
        width: item.width,
        height: item.height,
        transform: `rotate(${item.rotate}deg)`,
        opacity: item.opacity,
      }}
      onMouseDown={onMouseDownDrag}
    >
      <ImageOverlayImg src={item.src} alt="overlay" draggable={false} />

      {/* Always in DOM — visibility controlled by CSS :hover / aria-selected / data-active */}
      {(["nw", "ne", "sw", "se"] as const).map((side) => (
        <OverlayResizeHandle
          key={side}
          data-handle="resize"
          data-overlay-handle
          data-side={side}
          onMouseDown={onMouseDownResize(side)}
        />
      ))}

      <OverlayRotateHandle
        data-handle="rotate"
        data-overlay-handle
        onMouseDown={onMouseDownRotate}
      >
        <FontAwesomeIcon
          className={css({ w: "11px", h: "11px" })}
          icon={faRotateLeft}
        />
      </OverlayRotateHandle>

      {/* Delete only shown when selected */}
      <OverlayDeleteHandle
        data-handle="delete"
        data-overlay-handle
        type="button"
        aria-label="Delete overlay"
        style={{ display: isSelected ? undefined : "none" }}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(item.id);
        }}
      >
        <FontAwesomeIcon icon={faXmark} />
      </OverlayDeleteHandle>
    </ImageOverlayBox>
  );
};

export default React.memo(ImageOverlayDraggable);
