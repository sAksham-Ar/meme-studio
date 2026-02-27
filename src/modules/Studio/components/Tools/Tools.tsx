"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Tooltip from "@components/Tooltip";
import { Link } from "@i18n/navigation";
import { useShowModal } from "@stores/Modal/Modal.provider";
import { useImageOverlayStore } from "@stores/ImageOverlay/ImageOverlay.store";
import { Flex, styled } from "@styled-system/jsx";
import { faSquare } from "@fortawesome/free-regular-svg-icons";
import {
  faEraser,
  faFont,
  faImage,
  faQuestionCircle,
  faRedo,
  faSquare as faSquareFilled,
  faTrashRestore,
  faUndo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  useCanvasDimensions,
  useCountTextboxes,
  useHistory,
  useMeme,
  useTools,
} from "@viclafouch/meme-studio-utilities/hooks";
import { buttonRecipe, ToolsButton, ToolsListItem } from "./Tools.styles";

const Tools = () => {
  const t = useTranslations();
  const {
    eraseAllItems,
    resetAll,
    toggleTopBlockVisible,
    isTopBlockVisible,
    addItem,
  } = useTools();
  const countTexts = useCountTextboxes();
  const meme = useMeme();
  const showModal = useShowModal();
  const addImageOverlay = useImageOverlayStore((s) => s.addItem);
  const { canvasDimensions } = useCanvasDimensions();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { canUndo, canRedo, undo, redo } = useHistory();

  const handleClick = (callback: () => void) => {
    return (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      callback();
    };
  };

  const handleShowQaA = (event: React.MouseEvent<HTMLButtonElement>) => {
    handleClick(() => {
      return showModal("qaa", {});
    })(event);
  };

  const handleAddImageClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const src = e.target?.result as string;

      if (src) {
        addImageOverlay(
          src,
          canvasDimensions.width || 500,
          canvasDimensions.height || 500,
        );
      }
    };

    reader.readAsDataURL(file);
    // Reset input so same file can be re-selected
    event.target.value = "";
  };

  return (
    <Flex
      width="full"
      height="54px"
      justify="space-between"
      color="white"
      zIndex={3}
      overflowX="auto"
      overflowY="hidden"
      position="relative"
      bgColor="secondary.dark"
      boxShadow="2px 0px 5px 0px rgb(0 0 0 / 29%)"
      md={{
        flexDir: "column",
        h: "100%",
        overflow: "visible",
      }}
    >
      <styled.ul display="flex" flexDir={{ md: "column" }} alignItems="center">
        <ToolsListItem>
          <Tooltip text={t("tools.addText")} disabled={!meme} position="right">
            <ToolsButton
              type="button"
              disabled={!meme}
              onClick={handleClick(addItem)}
            >
              <FontAwesomeIcon icon={faFont} />
            </ToolsButton>
          </Tooltip>
        </ToolsListItem>
        <ToolsListItem>
          <Tooltip text={t("tools.addImage")} disabled={!meme} position="right">
            <ToolsButton
              type="button"
              disabled={!meme}
              onClick={handleAddImageClick}
            >
              <FontAwesomeIcon icon={faImage} />
            </ToolsButton>
          </Tooltip>
          <styled.input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            display="none"
            aria-hidden="true"
            onChange={handleFileChange}
          />
        </ToolsListItem>
        <ToolsListItem>
          <Tooltip
            text={
              isTopBlockVisible
                ? t("tools.deleteTopBlock")
                : t("tools.addTopBlock")
            }
            disabled={!meme}
            position="right"
          >
            <ToolsButton
              type="button"
              disabled={!meme}
              onClick={handleClick(toggleTopBlockVisible)}
            >
              <FontAwesomeIcon
                icon={isTopBlockVisible ? faSquareFilled : faSquare}
              />
            </ToolsButton>
          </Tooltip>
        </ToolsListItem>
        <ToolsListItem>
          <Tooltip text={t("tools.undo")} disabled={!canUndo} position="right">
            <ToolsButton
              type="button"
              disabled={!canUndo}
              onClick={handleClick(undo)}
            >
              <FontAwesomeIcon icon={faUndo} />
            </ToolsButton>
          </Tooltip>
        </ToolsListItem>
        <ToolsListItem>
          <Tooltip text={t("tools.redo")} disabled={!canRedo} position="right">
            <ToolsButton
              type="button"
              disabled={!canRedo}
              onClick={handleClick(redo)}
            >
              <FontAwesomeIcon icon={faRedo} />
            </ToolsButton>
          </Tooltip>
        </ToolsListItem>
        <ToolsListItem>
          <Tooltip
            text={t("tools.eraseAll")}
            disabled={countTexts === 0}
            position="right"
          >
            <ToolsButton
              type="button"
              disabled={countTexts === 0}
              onClick={handleClick(eraseAllItems)}
            >
              <FontAwesomeIcon icon={faEraser} />
            </ToolsButton>
          </Tooltip>
        </ToolsListItem>
        <ToolsListItem>
          <Tooltip text={t("tools.reset")} disabled={!meme} position="right">
            {!meme ? (
              <ToolsButton disabled>
                <FontAwesomeIcon icon={faTrashRestore} />
              </ToolsButton>
            ) : (
              <Link
                className={buttonRecipe()}
                href="/create"
                onClick={resetAll}
              >
                <FontAwesomeIcon icon={faTrashRestore} />
              </Link>
            )}
          </Tooltip>
        </ToolsListItem>
      </styled.ul>
      <styled.ul display="flex" flexDir="column" alignItems="center">
        <ToolsListItem>
          <Tooltip text={t("qAq.metadataTitle")} position="right">
            <ToolsButton type="button" onClick={handleShowQaA}>
              <FontAwesomeIcon icon={faQuestionCircle} />
            </ToolsButton>
          </Tooltip>
        </ToolsListItem>
      </styled.ul>
    </Flex>
  );
};

export default React.memo(Tools);
