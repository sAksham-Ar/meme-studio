'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import Button from '@components/Button'
import type { ImageOverlayItem } from '@stores/ImageOverlay/ImageOverlay.store'
import { useImageOverlayStore } from '@stores/ImageOverlay/ImageOverlay.store'
import { Box, HStack, styled, VStack } from '@styled-system/jsx'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCanvasDimensions } from '@viclafouch/meme-studio-utilities/hooks'

const ImageOverlaysPanel = () => {
  const t = useTranslations()
  const items = useImageOverlayStore((store) => store.items)
  const selectedId = useImageOverlayStore((store) => store.selectedId)
  const updateItem = useImageOverlayStore((store) => store.updateItem)
  const removeItem = useImageOverlayStore((store) => store.removeItem)
  const setSelectedId = useImageOverlayStore((store) => store.setSelectedId)
  const addItem = useImageOverlayStore((store) => store.addItem)

  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const { canvasDimensions } = useCanvasDimensions()

  const handleAddClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const reader = new FileReader()

    reader.onload = (readerEvent) => {
      const src = readerEvent.target?.result as string

      if (src) {
        addItem(
          src,
          canvasDimensions.width || 500,
          canvasDimensions.height || 500
        )
      }
    }

    reader.readAsDataURL(file)
    event.target.value = ''
  }

  const handleUpdate = (
    id: string,
    key: keyof Omit<ImageOverlayItem, 'id' | 'src'>
  ) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      updateItem(id, { [key]: parseFloat(event.target.value) })
    }
  }

  return (
    <Box overflowY="auto" overflowX="hidden" pb={10}>
      <VStack textAlign="center" p="2" m="2" gap={2}>
        <styled.span display="block" color="white">
          {t('common.imageOverlays')}
        </styled.span>
      </VStack>

      {items.length === 0 ? (
        <VStack p={4} textAlign="center">
          <styled.p color="gray.400" fontSize="sm">
            {t('common.noImageOverlays')}
          </styled.p>
        </VStack>
      ) : (
        <VStack gap={0}>
          {items.map((item, index) => {
            const isSelected = selectedId === item.id

            return (
              <Box
                key={item.id}
                w="full"
                borderBottom="1px solid rgba(200,200,200,0.2)"
              >
                <HStack
                  p={2}
                  justify="space-between"
                  cursor="pointer"
                  bg={isSelected ? 'primary' : 'transparent'}
                  onClick={() => setSelectedId(isSelected ? null : item.id)}
                >
                  <HStack gap={2}>
                    <styled.img
                      src={item.src}
                      alt={`overlay ${index + 1}`}
                      w="2rem"
                      h="2rem"
                      objectFit="contain"
                      borderRadius="sm"
                      bg="white"
                    />
                    <styled.span color="white" fontSize="sm">
                      {t('common.imageOverlay')} {index + 1}
                    </styled.span>
                  </HStack>
                  <styled.button
                    type="button"
                    color="red.400"
                    cursor="pointer"
                    aria-label={t('common.delete')}
                    onClick={(event) => {
                      event.stopPropagation()
                      removeItem(item.id)
                    }}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </styled.button>
                </HStack>

                {isSelected ? (
                  <Box p={3} bg="secondary.dark">
                    <VStack gap={3} alignItems="stretch">
                      <Box>
                        <styled.label
                          display="block"
                          color="white"
                          fontSize="xs"
                          mb={1}
                        >
                          {t('common.size')}
                        </styled.label>
                        <input
                          type="range"
                          min="20"
                          max="2000"
                          step="1"
                          value={item.width}
                          onChange={(event) => {
                            const newW = parseFloat(event.target.value)
                            const ratio = item.height / item.width

                            updateItem(item.id, {
                              width: newW,
                              height: newW * ratio
                            })
                          }}
                          style={{ width: '100%' }}
                        />
                      </Box>
                      <Box>
                        <styled.label
                          display="block"
                          color="white"
                          fontSize="xs"
                          mb={1}
                        >
                          {t('common.opacity')}
                        </styled.label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={item.opacity}
                          onChange={handleUpdate(item.id, 'opacity')}
                          style={{ width: '100%' }}
                        />
                      </Box>
                      <Box>
                        <styled.label
                          display="block"
                          color="white"
                          fontSize="xs"
                          mb={1}
                        >
                          {t('common.rotation')} ({Math.round(item.rotate)}°)
                        </styled.label>
                        <input
                          type="range"
                          min="-180"
                          max="180"
                          step="1"
                          value={item.rotate}
                          onChange={handleUpdate(item.id, 'rotate')}
                          style={{ width: '100%' }}
                        />
                      </Box>
                    </VStack>
                  </Box>
                ) : null}
              </Box>
            )
          })}
        </VStack>
      )}

      <Button rounded={false} fullWidth onClick={handleAddClick}>
        {t('common.addImageOverlay')}
      </Button>
      <styled.input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        display="none"
        aria-hidden="true"
        onChange={handleFileChange}
      />
    </Box>
  )
}

export default ImageOverlaysPanel
