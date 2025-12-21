import './styles.scss'

import { TextStyleKit } from '@tiptap/extension-text-style'
import type { Editor } from '@tiptap/react'
import { EditorContent, useEditor, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useState } from 'react'
import { useFetcher } from 'react-router'

const extensions = [TextStyleKit, StarterKit]

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
  // Read the current editor's state, and re-render the component when it changes
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
        <MenuButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          disabled={false}
        >
          Paragraph
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          disabled={false}
        >
          H1
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          disabled={false}
        >
          H2
        </MenuButton>
      </div>
    </div>
  )
}

export default function NewsEditor({articleId, articleJson} : {articleId : number, articleJson : string}){
  const fetcher = useFetcher()
  const [isSaved, setIsSaved] = useState(true)
  const [contentJson, setContentJson] = useState(articleJson)
  const editor = useEditor({
    extensions,
    content: JSON.parse(articleJson),
    onUpdate({ editor} ) {
      if(isSaved)
        setIsSaved(false)
      setContentJson(JSON.stringify(editor.getJSON()))
    },
    immediatelyRender: false 
  })
  function onClick(event : React.MouseEvent) {
    console.log("submit?")
    setIsSaved(false)
  }
  if(!editor){
    <div className='m-8'>
      Lapa nelādējas.
    </div>
  }
  else{
  return (
    <div>
      <fetcher.Form method="post" className='m-8'>
        <button className="m-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition items-center flex justify-center w-20 h-8" onClick={onClick} type="submit"> Save </button>
        <input type="hidden" name="contentJson" value={contentJson} />
        <input type="hidden" name="articleId" value={articleId} />
      </fetcher.Form>
      <div className='ml-8'>
        <MenuBar editor={editor} />
        <EditorContent className="m-2" editor={editor} />
      </div>
    </div>
    )
  }
}