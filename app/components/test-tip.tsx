import './styles.scss'

import { TextStyleKit } from '@tiptap/extension-text-style'
import type { Editor } from '@tiptap/react'
import { EditorContent, useEditor, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useState } from 'react'

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

function SaveButton({onClick} : {onClick : () => void}){
  return <button 
    className="m-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition items-center flex justify-center w-20 h-8"
    onClick={onClick}
  >
    Saglabāt!
  </button>
}

export default function TestTip(){
  const [isSaved, setIsSaved] = useState(true)
  const editor = useEditor({
    extensions,
    content: `<h2>
      Hi there,
    </h2> <h1> Hi meow</h1>`,
    onUpdate({ editor} ) {
      console.log("Claim: Content changed")
      const html = editor.getHTML()
      console.log(html)
      if(isSaved)
        setIsSaved(false)
    } 
  })

  function saveContent(){
    setIsSaved(true)
  }

  return (
    <div className="m-8">
      <div>{isSaved ? "Ok" : "Not Ok"}</div>
      <SaveButton onClick={saveContent}/>
      <MenuBar editor={editor} />
      <EditorContent className="m-2" editor={editor}/>
    </div>
  )
}