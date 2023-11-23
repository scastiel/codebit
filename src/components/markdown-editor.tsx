'use client'
import { ReactNode } from 'react'

type Props = {
  editorContent: ReactNode
  settingsContent: ReactNode
  toolbarContent: ReactNode
}

export function MarkdownEditor({
  editorContent,
  settingsContent,
  toolbarContent,
}: Props) {
  return editorContent
  // return (
  //   <Tabs defaultValue="steps" className="w-full h-full flex flex-col">
  //     <div className="flex flex-col-reverse gap-2 md:flex-row justify-between">
  //       <TabsList>
  //         <TabsTrigger value="steps">Steps</TabsTrigger>
  //         <TabsTrigger value="settings">Settings</TabsTrigger>
  //       </TabsList>

  //       <div className="flex gap-2 flex-wrap items-center">
  //         {toolbarContent}
  //       </div>
  //     </div>
  //     <TabsContent value="steps" className="flex-1">
  //       {editorContent}
  //     </TabsContent>
  //     <TabsContent value="settings" className="flex-1">
  //       {settingsContent}
  //     </TabsContent>
  //   </Tabs>
  // )
}
