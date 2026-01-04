import './styles.scss'

import Image from '@tiptap/extension-image'
import { TextStyleKit } from '@tiptap/extension-text-style'
import type { Editor } from '@tiptap/react'
import { EditorContent, useEditor, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useEffect, useRef, useState } from 'react'
import { useFetcher } from 'react-router'
import type { UploadArticle } from '~/types/content'

function MenuButton({onClick, disabled, children} : {onClick : () => void, disabled: boolean, children: React.ReactNode}) {
  return <button 
    onClick={onClick} 
    disabled={disabled} 
    className="m-1 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition items-center flex justify-center w-20 h-8"
  >
    {children}
  </button>
}

function MenuBar({ editor }: { editor: Editor }) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const fetcher = useFetcher()

  useEffect(() => {
    if(fetcher.data && fetcher.data.imgUrl){
      const src = fetcher.data.imgUrl
      editor.chain().focus().setImage({ src }).run()
    }
  }, [fetcher.data])

  async function insertLocalImage(file: File) {
      const formData = new FormData()
      formData.append("img", file)
      await fetcher.submit(formData, {
        method: "post",
        encType: "multipart/form-data"
      })
  }
  const editorState = useEditorState({
    editor,
    selector: ctx => {
      return {
        isBold: ctx.editor.isActive('bold') ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive('italic') ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isStrike: ctx.editor.isActive('strike') ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        isParagraph: ctx.editor.isActive('paragraph') ?? false,
        isHeading1: ctx.editor.isActive('heading', { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive('heading', { level: 2 }) ?? false,
      }
    },
  })

  return (
    <div className="m-2">
      <div className="flex flex-row">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editorState.canBold}
        >
          Bold
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editorState.canItalic}
        >
          Italic
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editorState.canStrike}
        >
          Strike
        </MenuButton>

        <MenuButton onClick={() => fileInputRef.current?.click()} disabled={false}>
          Attēls
        </MenuButton>
        
        <input
          className='border bg-amber-500 px-3 py-2 h-8 w-4'
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return
            insertLocalImage(file)
            e.currentTarget.value = '' // allow same file re-pick
          }}
        />
      </div>
    </div>
  )
}

export default function NewsEditor({articleJson, newArticle, articleTitle, isEditable, saveTitle, onSave} : {articleJson : string, newArticle : boolean, articleTitle : string, isEditable : boolean, saveTitle : string, onSave : (arg: UploadArticle) => void}){
  const fetcher = useFetcher()
  const [isSaved, setIsSaved] = useState(true)
  const [contentJson, setContentJson] = useState(articleJson)
  const [title, setTitle] = useState(articleTitle)

  const extensions = [TextStyleKit, StarterKit, Image.configure({
    resize: {
      enabled: isEditable,
      alwaysPreserveAspectRatio: true,
    }
  })]

  const editor = useEditor({
    extensions,
    content: JSON.parse(articleJson),
    onUpdate({ editor} ) {
      if(isSaved)
        setIsSaved(false)
      setContentJson(JSON.stringify(editor.getJSON()))
    },
    immediatelyRender: false,
    editable: isEditable
  })
  function onClick(event : React.MouseEvent) {
    setIsSaved(true)
    onSave({
      jsonBody: contentJson,
      title: title
    })
  }
  if(!editor){
    <div className='m-8'>
      Lapa nelādējas.
    </div>
  }
  else{
    return (
      <div className='mx-8'>
        {
          isEditable &&
          <>
            <div className='font-bold text-2xl'>
              Virsraksts
            </div>
            <input className="h-8 w-full border" placeholder='Virsraksts' value={title} onChange={(e) => setTitle(e.target.value)} />
          </>
        }
        {
          !isEditable &&
          <div className="font-bold text-2xl"> {title} </div>
        }
        <div>
          {
            isEditable &&
            <MenuBar editor={editor} />
          }
          {
            isEditable &&
            <div className='flex flex-row items-center'>
              <button onClick={onClick} className="px-3 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700">{saveTitle}</button>
              <div className='ml-3 text-xs'> 
                { !newArticle ?
                  (isSaved ? "Jūsu izmaiņas ir saglabātas un publiski pieejamas" : "Jūsu izmaiņas nav saglabātas") : ""
                }
              </div>
            </div>
          }
          <EditorContent className="m-2" editor={editor} />
        </div>
      </div>
    )
  }
}