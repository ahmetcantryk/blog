"use client"

import React from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  height?: number
  className?: string
  disabled?: boolean
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "İçeriğinizi buraya yazın...",
  height = 400,
  className,
  disabled = false
}: RichTextEditorProps) {
  const { theme } = useTheme()

  return (
    <div className={cn(
      "relative border border-input rounded-md overflow-hidden bg-background",
      "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
      disabled && "opacity-50 cursor-not-allowed",
      className
    )}>
      <Editor
        apiKey="oes7u8qxmak7fpetg6qfs55cuqn24sqygkvmnih7rogotw75"
        value={value}
        onEditorChange={onChange}
        disabled={disabled}
        init={{
          height: height,
          menubar: false,
          skin: theme === 'dark' ? 'oxide-dark' : 'oxide',
          content_css: theme === 'dark' ? 'dark' : 'default',
          plugins: [
            // Core editing features
            'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
            // Premium features
            'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'advtemplate', 'ai', 'uploadcare', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown', 'importword', 'exportword', 'exportpdf'
          ],
          toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography uploadcare | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
          tinycomments_mode: 'embedded',
          tinycomments_author: 'Yazar',
          mergetags_list: [
            { value: 'First.Name', title: 'Ad' },
            { value: 'Email', title: 'E-posta' },
          ],
          ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('AI Assistant özelliği henüz aktif değil')),
          uploadcare_public_key: 'ffc6cb7d3820eaa04695',
          content_style: `
            body { 
              font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
              font-size: 14px;
              line-height: 1.6;
              color: ${theme === 'dark' ? 'hsl(210 40% 98%)' : 'hsl(222.2 84% 4.9%)'};
              background-color: ${theme === 'dark' ? 'hsl(222.2 84% 4.9%)' : 'hsl(0 0% 100%)'};
              padding: 16px;
              margin: 0;
            }
            
            /* Headings */
            h1, h2, h3, h4, h5, h6 { 
              margin-top: 1.5em; 
              margin-bottom: 0.5em; 
              font-weight: 600;
              line-height: 1.25;
            }
            h1 { font-size: 2.25em; }
            h2 { font-size: 1.875em; }
            h3 { font-size: 1.5em; }
            h4 { font-size: 1.25em; }
            h5 { font-size: 1.125em; }
            h6 { font-size: 1em; }
            
            /* Paragraphs */
            p { 
              margin: 1em 0; 
              line-height: 1.75;
            }
            
            /* Lists */
            ul, ol { 
              margin: 1em 0; 
              padding-left: 2em; 
            }
            li { margin: 0.5em 0; }
            
            /* Blockquotes */
            blockquote { 
              margin: 1.5em 0; 
              padding: 1em 1.5em;
              border-left: 4px solid ${theme === 'dark' ? 'hsl(215 27.9% 16.9%)' : 'hsl(214.3 31.8% 91.4%)'};
              background-color: ${theme === 'dark' ? 'hsl(215 27.9% 16.9%)' : 'hsl(210 40% 98%)'};
              font-style: italic;
              color: ${theme === 'dark' ? 'hsl(215 20.2% 65.1%)' : 'hsl(215.4 16.3% 46.9%)'};
              border-radius: 6px;
            }
            
            /* Code */
            code { 
              background-color: ${theme === 'dark' ? 'hsl(215 27.9% 16.9%)' : 'hsl(210 40% 98%)'};
              color: ${theme === 'dark' ? 'hsl(210 40% 98%)' : 'hsl(222.2 84% 4.9%)'};
              padding: 2px 6px; 
              border-radius: 4px; 
              font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
              font-size: 0.875em;
            }
            
            pre {
              background-color: ${theme === 'dark' ? 'hsl(215 27.9% 16.9%)' : 'hsl(210 40% 98%)'};
              padding: 1em;
              border-radius: 6px;
              overflow-x: auto;
              margin: 1em 0;
            }
            
            pre code {
              background-color: transparent;
              padding: 0;
            }
            
            /* Tables */
            table {
              border-collapse: collapse;
              width: 100%;
              margin: 1em 0;
            }
            
            th, td {
              border: 1px solid ${theme === 'dark' ? 'hsl(215 27.9% 16.9%)' : 'hsl(214.3 31.8% 91.4%)'};
              padding: 8px 12px;
              text-align: left;
            }
            
            th {
              background-color: ${theme === 'dark' ? 'hsl(215 27.9% 16.9%)' : 'hsl(210 40% 98%)'};
              font-weight: 600;
            }
            
            /* Links */
            a {
              color: ${theme === 'dark' ? 'hsl(213 94% 68%)' : 'hsl(221.2 83.2% 53.3%)'};
              text-decoration: underline;
            }
            
            a:hover {
              color: ${theme === 'dark' ? 'hsl(213 94% 78%)' : 'hsl(221.2 83.2% 43.3%)'};
            }
            
            /* Images */
            img {
              max-width: 100%;
              height: auto;
              border-radius: 6px;
            }
            
            /* HR */
            hr {
              border: none;
              border-top: 1px solid ${theme === 'dark' ? 'hsl(215 27.9% 16.9%)' : 'hsl(214.3 31.8% 91.4%)'};
              margin: 2em 0;
            }
          `,
          placeholder: placeholder,
          branding: false,
          statusbar: false,
          resize: 'both',
          elementpath: false,
          promotion: false,
          setup: (editor) => {
            // Editör hazır olduğunda tema ayarlarını uygula
            editor.on('init', () => {
              if (theme === 'dark') {
                editor.dom.addClass(editor.getBody(), 'dark-mode')
              }
            })
            
            // Tema değişikliklerini dinle
            editor.on('ExecCommand', (e) => {
              if (e.command === 'mceToggleFormat') {
                // Format değişikliklerinde stil güncellemelerini yap
                setTimeout(() => {
                  const body = editor.getBody()
                  if (body) {
                    body.style.color = theme === 'dark' ? 'hsl(210 40% 98%)' : 'hsl(222.2 84% 4.9%)'
                    body.style.backgroundColor = theme === 'dark' ? 'hsl(222.2 84% 4.9%)' : 'hsl(0 0% 100%)'
                  }
                }, 100)
              }
            })
          }
        }}
      />
    </div>
  )
}

