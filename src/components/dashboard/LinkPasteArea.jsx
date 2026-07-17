import { useState } from 'react'
import { DocumentTextIcon } from '@heroicons/react/24/outline'

export default function LinkPasteArea({ onCompare, isLoading }) {
  const [text, setText] = useState('')

  const handleSubmit = () => {
    if (text.trim()) {
      onCompare(text.trim())
    }
  }

  const handlePaste = async () => {
    try {
      const clipText = await navigator.clipboard.readText()
      if (clipText) setText(clipText)
    } catch {
      /* fallback */
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Dán link bài viết từ Facebook, Chợ Tốt, hoặc copy-paste đoạn text mô tả sản phẩm vào đây..."
        rows={5}
        className="input-field min-h-[140px] md:min-h-[160px] resize-none pt-3"
        disabled={isLoading}
      />
      <div className="flex gap-2">
        <button
          onClick={handlePaste}
          className="btn-secondary flex-1 h-11"
          type="button"
        >
          <DocumentTextIcon className="w-4 h-4 mr-1.5" />
          Dán từ clipboard
        </button>
        <button
          onClick={handleSubmit}
          disabled={!text.trim() || isLoading}
          className="btn-primary flex-1 h-11"
        >
          Phân tích
        </button>
      </div>
    </div>
  )
}
