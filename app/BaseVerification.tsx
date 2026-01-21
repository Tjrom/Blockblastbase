'use client'

import { useEffect } from 'react'

export default function BaseVerification() {
  useEffect(() => {
    // Проверяем, есть ли уже метатег
    const existingMeta = document.querySelector('meta[name="base:app_id"]')
    if (!existingMeta) {
      // Создаем и добавляем метатег
      const meta = document.createElement('meta')
      meta.name = 'base:app_id'
      meta.content = '6971069c5f24b57cc50d333c'
      document.head.appendChild(meta)
    }
  }, [])

  return null
}
