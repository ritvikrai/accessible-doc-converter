'use client'
import { useState } from 'react'
import { FileText, Upload, Eye, Ear, Type, Loader2, CheckCircle, Download } from 'lucide-react'

export default function Home() {
  const [file, setFile] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [options, setOptions] = useState({
    screenReader: true,
    largeText: false,
    highContrast: false,
    audioVersion: false,
    simplifiedLanguage: false,
  })

  const processDocument = async () => {
    if (!file) return
    setProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setResult({
      originalIssues: 12,
      fixed: 11,
      accessibilityScore: 95,
      improvements: [
        'Added alt text to 8 images',
        'Fixed heading hierarchy',
        'Added document language attribute',
        'Improved table accessibility',
        'Enhanced link descriptions',
      ],
      formats: ['PDF/UA', 'HTML5', 'EPUB', 'Audio (MP3)']
    })
    setProcessing(false)
  }

  const handleFileDrop = (e) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) setFile(droppedFile)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-violet-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <Eye className="text-indigo-600" />
          Accessible Docs
        </h1>
        <p className="text-gray-600 mb-8">Make any document accessible to everyone</p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div
              onDrop={handleFileDrop}
              onDragOver={(e) => e.preventDefault()}
              className="bg-white rounded-xl p-8 shadow-sm border-2 border-dashed border-indigo-200 text-center cursor-pointer hover:border-indigo-400 transition-colors"
            >
              <input type="file" className="hidden" id="file-input" onChange={(e) => setFile(e.target.files[0])} />
              <label htmlFor="file-input" className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto text-indigo-400 mb-3" />
                {file ? (
                  <p className="text-indigo-600 font-medium">{file.name}</p>
                ) : (
                  <p className="text-gray-600">Drop PDF, Word, or image files here</p>
                )}
              </label>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h3 className="font-medium text-gray-800 mb-4">Accessibility Options</h3>
              <div className="space-y-3">
                {[
                  { key: 'screenReader', icon: Ear, label: 'Screen Reader Compatible' },
                  { key: 'largeText', icon: Type, label: 'Large Text Version' },
                  { key: 'highContrast', icon: Eye, label: 'High Contrast Mode' },
                  { key: 'audioVersion', icon: Ear, label: 'Generate Audio Version' },
                  { key: 'simplifiedLanguage', icon: FileText, label: 'Simplify Language' },
                ].map(({ key, icon: Icon, label }) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options[key]}
                      onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <Icon size={18} className="text-indigo-500" />
                    <span className="text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={processDocument}
              disabled={!file || processing}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {processing ? <><Loader2 className="animate-spin" /> Converting...</> : 'Make Accessible'}
            </button>
          </div>

          {result && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl p-6 text-white text-center">
                <p className="text-indigo-100">Accessibility Score</p>
                <p className="text-5xl font-bold">{result.accessibilityScore}%</p>
                <p className="text-indigo-100 mt-1">{result.fixed}/{result.originalIssues} issues fixed</p>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="font-medium text-gray-800 mb-3">Improvements Made</h3>
                <ul className="space-y-2">
                  {result.improvements.map((imp, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="text-green-500" size={16} /> {imp}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="font-medium text-gray-800 mb-3">Download Formats</h3>
                <div className="grid grid-cols-2 gap-2">
                  {result.formats.map((format) => (
                    <button key={format} className="p-3 border border-indigo-200 rounded-lg text-indigo-600 hover:bg-indigo-50 flex items-center justify-center gap-2">
                      <Download size={16} /> {format}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
