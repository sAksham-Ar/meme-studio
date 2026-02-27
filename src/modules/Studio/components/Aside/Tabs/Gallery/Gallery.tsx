'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import MemesList from '@components/MemesList'
import { styled, VStack } from '@styled-system/jsx'
import type { Meme } from '@viclafouch/meme-studio-utilities/schemas'

export type GalleryProps = {
  memesPromise: Promise<Meme[]>
}

const Gallery = ({ memesPromise }: GalleryProps) => {
  const memes = React.use(memesPromise)
  const t = useTranslations()
  const [query, setQuery] = React.useState('')

  const filtered = React.useMemo(() => {
    const search = query.trim().toLowerCase()

    if (!search) {
      return memes
    }

    return memes.filter((meme) => {
      if (meme.name.toLowerCase().includes(search)) {
        return true
      }

      if (meme.keywords.some((kw) => kw.toLowerCase().includes(search))) {
        return true
      }

      return false
    })
  }, [memes, query])

  return (
    <VStack gap="0" h="full">
      <styled.div w="full" p="2" flexShrink={0}>
        <styled.input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('common.searchMemes')}
          w="full"
          px="3"
          py="2"
          fontSize="sm"
          borderRadius="md"
          borderWidth="1px"
          borderStyle="solid"
          borderColor="gray.400"
          bgColor="white"
          color="gray.800"
          outline="none"
          _focus={{
            borderColor: 'blue.500',
            boxShadow: '0 0 0 1px var(--colors-blue-500)'
          }}
        />
      </styled.div>
      <styled.div overflowY="auto" w="full" flex={1}>
        {filtered.length > 0 ? (
          <MemesList disableHoverShowTitle memes={filtered} />
        ) : (
          <styled.p
            textAlign="center"
            color="gray.400"
            fontSize="sm"
            py="8"
            px="4"
          >
            {t('common.noMemesFound')}
          </styled.p>
        )}
      </styled.div>
    </VStack>
  )
}

export default Gallery
