import React, { useEffect, useState } from 'react'
import BlogPost from '../components/BlogPost'
import { BlogPostData } from '../lib/blog-posts'
import { markdownToHtml } from '../../lib/markdown-processor'
import { loadGpx } from '../../lib/parseGpx'

interface BlogPostPreviewProps {}

const BlogPostPreview = ({ entry, widgetFor }) => {
  const title = entry.getIn(['data', 'title'])
  // etc.
  const gpxUrl = entry.getIn(['data', 'gpxUrl'])
  // ...

  const post = {
    attributes: {
      title,
      gpxUrl,
    },
    html: content,
    relatedArticles: [],
  } as BlogPostData

  // workaround in my case
  // to load and parse the gpx file
  // typically not required
  useEffect(() => {
    ;(async () => {
      if (gpxUrl) {
        const gpxData = await loadGpx(gpxUrl)
        setGpxData(gpxData)
      }
    })()
  }, [gpxUrl])

  return <BlogPost post={{ ...post, gpxData }} />
}
export default BlogPostPreview