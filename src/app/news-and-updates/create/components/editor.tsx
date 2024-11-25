'use client'

import React, { useState, Dispatch, SetStateAction } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Box } from '@chakra-ui/react'

interface EnhancedEditorProps {
  value: string
  onChange: Dispatch<SetStateAction<string>>
  height?: string
}

const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      ['link', 'image'],
      ['clean'],
    ],
    handlers: {
      image: handleImageUpload,
    },
  },
}

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'bullet',
  'script',
  'indent',
  'align',
  'link',
  'image',
]

async function handleImageUpload(this: any) {
  const input = document.createElement('input')
  input.setAttribute('type', 'file')
  input.setAttribute('accept', 'image/*')

  input.addEventListener('change', async () => {
    const file = input.files?.[0]
    if (file) {
      try {
        const imageUrl = await uploadToCloudflareAPI(file)

        if (imageUrl) {
          const quill = this.quill
          const range = quill.getSelection()
          const index = range ? range.index : quill.getLength()
          quill.insertEmbed(index, 'image', imageUrl)
          quill.setSelection(index + 1)
        }
      } catch (error) {
        console.error('Image upload failed:', error)
      }
    }
  })

  input.click()
}

const uploadToCloudflareAPI = async (file: File) => {
  const relativePath = `${Date.now()}-${file.name}`
  const formData = new FormData()
  formData.append('path', `montessori--images--${relativePath}`)
  formData.append('file', file)

  try {
    const res = await fetch('/api/uploadImage', {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) {
      const errorData = await res.json()
      console.error('Failed to upload image:', errorData.error)
      throw new Error('Failed to upload image to Cloudflare.')
    }

    const data = await res.json()
    return data?.url || ''
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

// function getImageDataUrl(file: File): Promise<string> {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader()
//     reader.onloadend = () => {
//       resolve(reader.result as string)
//     }
//     reader.onerror = reject
//     reader.readAsDataURL(file)
//   })
// }

const EnhancedEditor: React.FC<EnhancedEditorProps> = ({
  value,
  onChange,
  height,
}) => {
  return (
    <Box>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder="Write your content here..."
        style={{ height: height || '400px' }}
      />
    </Box>
  )
}

export default EnhancedEditor
