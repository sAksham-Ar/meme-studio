"use client";

import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useTranslations } from "next-intl";
import { TabButton } from "@studio/components/Aside/Aside.styles";
import EmptyCustom from "@studio/components/Aside/Tabs/Customisation/EmptyCustom";
import { GallerySuspend } from "@studio/components/Aside/Tabs/Gallery";
import ImageOverlaysPanel from "@studio/components/Aside/Tabs/ImageOverlays";
import { css } from "@styled-system/css";
import { styled, VStack } from "@styled-system/jsx";
import {
  faCircleExclamation,
  faHeading,
  faImage,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMeme, useTab } from "@viclafouch/meme-studio-utilities/hooks";
import type { Meme } from "@viclafouch/meme-studio-utilities/schemas";
import type { Tab } from "@viclafouch/meme-studio-utilities/stores";
import Customisation from "./Tabs/Customisation";
import Gallery from "./Tabs/Gallery/Gallery";

export type AsideProps = {
  memesPromise: Promise<Meme[]>;
};

type LocalTab = Tab | "images";

const Aside = ({ memesPromise }: AsideProps) => {
  const t = useTranslations();
  const { currentTab, setCurrentTab } = useTab();
  const meme = useMeme();
  const [localTab, setLocalTab] = React.useState<LocalTab>(currentTab);

  // Keep localTab in sync when currentTab changes externally
  React.useEffect(() => {
    setLocalTab(currentTab);
  }, [currentTab]);

  const handleChangeTab = (event: React.MouseEvent<HTMLButtonElement>) => {
    const id = event.currentTarget.id as LocalTab;

    setLocalTab(id);

    if (id !== "images") {
      setCurrentTab(id as Tab);
    }
  };

  return (
    <styled.aside
      display="flex"
      width="full"
      flexDir="column"
      bgColor="secondary"
      zIndex={2}
      height="calc(100vh - 5rem)"
    >
      <styled.header display="flex" width="full">
        <TabButton
          id="gallery"
          aria-label={t("tools.goToGallery")}
          onClick={handleChangeTab}
          aria-current={localTab === "gallery"}
        >
          <FontAwesomeIcon icon={faImage} />
        </TabButton>
        <TabButton
          id="customization"
          aria-label={t("tools.goToCustomization")}
          onClick={handleChangeTab}
          aria-current={localTab === "customization"}
        >
          <FontAwesomeIcon icon={faHeading} />
        </TabButton>
        <TabButton
          id="images"
          aria-label={t("tools.goToImages")}
          onClick={handleChangeTab}
          aria-current={localTab === "images"}
        >
          <FontAwesomeIcon icon={faLayerGroup} />
        </TabButton>
      </styled.header>
      {localTab === "gallery" ? (
        <ErrorBoundary
          fallback={
            <VStack textAlign="center" pt={5}>
              <FontAwesomeIcon
                className={css({ fontSize: 30 })}
                icon={faCircleExclamation}
              />
              Something went wrong
            </VStack>
          }
        >
          <React.Suspense fallback={<GallerySuspend />}>
            <Gallery memesPromise={memesPromise} />
          </React.Suspense>
        </ErrorBoundary>
      ) : localTab === "images" ? (
        <ImageOverlaysPanel />
      ) : (
        <>{meme ? <Customisation meme={meme} /> : <EmptyCustom />}</>
      )}
    </styled.aside>
  );
};

export default Aside;
