<template>
  <div class="min-h-screen bg-white p-6">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-8 text-center">Test PDF Generation</h1>
        
        <!-- Simple form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">ชื่อ (Name)</label>
              <input v-model="form.name" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="กรอกชื่อ" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">นามสกุล (Last Name)</label>
              <input v-model="form.lastName" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="กรอกนามสกุล" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">เลขบ้าน (House Number)</label>
              <input v-model="form.houseNumber" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="กรอกเลขบ้าน" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">ที่อยู่ (Address)</label>
              <input v-model="form.address" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="กรอกที่อยู่" />
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-center">
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg">
              สร้างรายงาน (Generate Report)
            </button>
          </div>
        </form>
      </div>

      <!-- Report Preview Section -->
      <div v-if="showReport" class="mt-8 bg-white rounded-lg shadow-lg p-8" id="report-content">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">รายงานทดสอบ</h2>
          <div class="text-lg text-gray-700 space-y-2">
            <p class="title-text"><strong>ชื่อ:</strong> {{ form.name }} {{ form.lastName }}</p>
            <p><strong>เลขบ้าน:</strong> {{ form.houseNumber }}</p>
            <p><strong>ที่อยู่:</strong> {{ form.address }}</p>
          </div>
        </div>

        <!-- Sample Images -->
        <div class="mt-8">
          <div class="flex justify-center gap-4 mb-4">
            <div class="w-32 h-24 bg-gray-200 border-2 border-gray-400 rounded flex items-center justify-center report-image">
              <span class="text-gray-600">รูปภาพ 1</span>
            </div>
            <div class="w-32 h-24 bg-gray-200 border-2 border-gray-400 rounded flex items-center justify-center report-image">
              <span class="text-gray-600">รูปภาพ 2</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-center gap-4 mt-8">
          <button @click="printReport" class="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg">
            📄 สร้าง PDF
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// No auth middleware for testing
definePageMeta({
  layout: false
})

// Form data
const form = ref({
  name: 'มานี',
  lastName: 'มะนาว',
  houseNumber: '123',
  address: 'ตำบลลาดมะขาม อำเภอเมือง จังหวัดระยอง'
})

const showReport = ref(false)

// Handle form submission
const handleSubmit = () => {
  showReport.value = true
}

// PDF generation using iframe isolation
const printReport = async () => {
  try {
    console.log('Starting PDF generation...')
    
    // Dynamic import
    const html2canvas = (await import('html2canvas')).default
    const jsPDF = (await import('jspdf')).default
    
    console.log('Libraries loaded successfully')
    
    // Create iframe for complete CSS isolation
    const iframe = document.createElement('iframe')
    iframe.style.cssText = `
      position: fixed;
      top: -9999px;
      left: -9999px;
      width: 800px;
      height: 1200px;
      border: none;
      z-index: -1;
    `
    document.body.appendChild(iframe)
    
    // Wait for iframe to be ready
    await new Promise(resolve => {
      iframe.onload = resolve
      if (iframe.contentDocument) resolve()
    })
    
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
    
    // Create clean HTML in iframe
    iframeDoc.open()
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;600&display=swap" rel="stylesheet">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Sarabun', sans-serif;
            font-size: 16px;
            color: #333333;
            background: #ffffff;
            padding: 20px;
            line-height: 1.4;
          }
          .title {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 30px;
            color: #333333;
          }
          .content {
            text-align: center;
            font-size: 18px;
            margin-bottom: 20px;
          }
          .images {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 30px;
          }
          .image-box {
            width: 150px;
            height: 100px;
            background: #f0f0f0;
            border: 2px solid #333333;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            color: #666666;
          }
        </style>
      </head>
      <body>
        <div class="title">รายงานทดสอบ</div>
        <div class="content">
          <p><strong>ชื่อ:</strong> ${form.value.name} ${form.value.lastName}</p>
          <p><strong>เลขบ้าน:</strong> ${form.value.houseNumber}</p>
          <p><strong>ที่อยู่:</strong> ${form.value.address}</p>
        </div>
        <div class="images">
          <div class="image-box">รูปภาพ 1</div>
          <div class="image-box">รูปภาพ 2</div>
        </div>
      </body>
      </html>
    `)
    iframeDoc.close()
    
    console.log('Iframe content created')
    
    // Wait a bit for fonts to load
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Capture the iframe content
    console.log('Capturing canvas...')
    const canvas = await html2canvas(iframeDoc.body, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      width: 800,
      height: iframeDoc.body.scrollHeight
    })
    
    console.log('Canvas captured:', canvas.width + 'x' + canvas.height)
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })
    
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const canvasWidth = canvas.width
    const canvasHeight = canvas.height
    
    // Calculate scaling to fit page width
    const scale = pageWidth / (canvasWidth / 2) // Divide by 2 because we used scale: 2
    const scaledHeight = (canvasHeight / 2) * scale
    
    const imgData = canvas.toDataURL('image/png', 1.0)
    
    if (scaledHeight <= pageHeight) {
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, scaledHeight)
    } else {
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight)
    }
    
    // Save the PDF
    const filename = `test-${form.value.name}-${form.value.lastName}.pdf`
    pdf.save(filename)
    
    console.log('PDF saved:', filename)
    
    // Cleanup
    if (iframe && iframe.parentNode) {
      document.body.removeChild(iframe)
    }
    
    alert('PDF สร้างสำเร็จแล้ว! ✅')
    
  } catch (error) {
    console.error('PDF generation error:', error)
    alert('เกิดข้อผิดพลาดในการสร้าง PDF: ' + error.message)
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;600&display=swap');

* {
  font-family: 'Sarabun' !important;
}

.report-image {
  font-family: 'Sarabun' !important;
}
</style>