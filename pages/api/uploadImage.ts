import { NextApiRequest, NextApiResponse } from 'next'
import formidable, { Fields, Files } from 'formidable'
import fs from 'fs'
import FormData from 'form-data'
import fetch from 'node-fetch'

const CLOUDFLARE_UPLOAD_URL = `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ID}/images/v1`

export const config = {
  api: {
    bodyParser: false,
  },
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('Upload Image API!')

  if (req.method === 'POST') {
    const form = formidable()

    form.parse(req, async (err: any, fields: Fields, files: Files) => {
      console.log('fields', fields)

      if (err) {
        console.error('Error parsing form:', err)
        return res.status(500).json({ error: 'Error parsing the form data' })
      }

      const file =
        files.file && Array.isArray(files.file) ? files.file[0] : files.file
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' })
      }

      if (!fields.path || fields.path.length === 0) {
        return res.status(400).json({ error: 'No image path provided' })
      }

      const customFileName = fields.path[0]

      try {
        const formData = new FormData()
        formData.append(
          'file',
          fs.createReadStream(file.filepath),
          customFileName
        )
        formData.append(
          'metadata',
          JSON.stringify({ filename: customFileName })
        )

        const imageUploadResponse = await fetch(CLOUDFLARE_UPLOAD_URL, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.CF_IMAGES_TOKEN}`,
          },
          body: formData,
        })

        const imageUploadData: any = await imageUploadResponse.json()

        console.log('Cloudflare image upload response:', imageUploadData)

        if (!imageUploadResponse.ok) {
          throw new Error(
            imageUploadData.errors?.[0]?.message ||
              'Failed to upload image to Cloudflare'
          )
        }
        const publicVariant = imageUploadData.result?.variants?.find(
          (variant: string) => variant.includes('public')
        )

        if (!publicVariant) {
          throw new Error('Public URL not found in Cloudflare response')
        }

        res.status(200).json({
          success: true,
          url: publicVariant,
        })
      } catch (error: any) {
        console.error('Error during image upload process:', error)
        res
          .status(500)
          .json({ error: error.message || 'Internal server error' })
      }
    })
  } else {
    res.status(405).json({ message: 'Only POST requests are allowed' })
  }
}

export default handler
