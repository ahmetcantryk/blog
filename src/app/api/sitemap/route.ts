import { NextRequest, NextResponse } from 'next/server'
import { updateSitemap, generateSitemapUrls, generateSitemapXml } from '@/lib/sitemap-generator'

export async function GET(request: NextRequest) {
  try {
    // Generate sitemap URLs
    const urls = await generateSitemapUrls()
    
    // Generate XML
    const sitemapXml = generateSitemapXml(urls)
    
    return new NextResponse(sitemapXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return NextResponse.json(
      { error: 'Failed to generate sitemap' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Manual sitemap update
    const success = await updateSitemap()
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Sitemap updated successfully'
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to update sitemap' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error updating sitemap:', error)
    return NextResponse.json(
      { error: 'Failed to update sitemap' },
      { status: 500 }
    )
  }
}
