<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-8 text-center">Basic Report</h1>
        
        <!-- Form Section -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Personal Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                ชื่อ (Name)
              </label>
              <input
                v-model="form.name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="กรอกชื่อ"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                นามสกุล (Last Name)
              </label>
              <input
                v-model="form.lastName"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="กรอกนามสกุล"
              />
            </div>
          </div>

          <!-- Address Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                เลขบ้าน (House Number)
              </label>
              <input
                v-model="form.houseNumber"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="กรอกเลขบ้าน"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                หมู่ที่ (Moo Number)
              </label>
              <input
                v-model="form.mooMuNumber"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="กรอกหมู่ที่"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                ตำบล (Tambon)
              </label>
              <input
                v-model="form.tambon"
                @blur="saveLocation"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="กรอกตำบล"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                อำเภอ (Amphur)
              </label>
              <input
                v-model="form.amphur"
                @blur="saveLocation"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="กรอกอำเภอ"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                จังหวัด (Province)
              </label>
              <input
                v-model="form.province"
                @blur="saveLocation"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="กรอกจังหวัด"
              />
            </div>
          </div>

          <!-- Settings Section -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Font Size Setting -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                ขนาดตัวอักษร (Font Size)
              </label>
              <div class="flex items-center gap-2">
                <input
                  v-model="fontSize"
                  @change="saveFontSize"
                  type="range"
                  min="12"
                  max="24"
                  step="1"
                  class="flex-1"
                />
                <span class="text-sm text-gray-600 min-w-[50px]">{{ fontSize }}px</span>
              </div>
              <div class="flex gap-2 mt-2">
                <button
                  @click="fontSize = 14; saveFontSize()"
                  type="button"
                  class="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  :class="{ 'bg-blue-500 text-white hover:bg-blue-600': fontSize === 14 }"
                >
                  เล็ก
                </button>
                <button
                  @click="fontSize = 16; saveFontSize()"
                  type="button"
                  class="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  :class="{ 'bg-blue-500 text-white hover:bg-blue-600': fontSize === 16 }"
                >
                  กลาง
                </button>
                <button
                  @click="fontSize = 18; saveFontSize()"
                  type="button"
                  class="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  :class="{ 'bg-blue-500 text-white hover:bg-blue-600': fontSize === 18 }"
                >
                  ใหญ่
                </button>
              </div>
            </div>

            <!-- Font Weight Setting -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                น้ำหนักตัวอักษร (Font Weight)
              </label>
              <div class="flex items-center gap-2">
                <input
                  v-model="fontWeight"
                  @change="saveFontWeight"
                  type="range"
                  min="300"
                  max="700"
                  step="100"
                  class="flex-1"
                />
                <span class="text-sm text-gray-600 min-w-[50px]">{{ fontWeight }}</span>
              </div>
              <div class="flex gap-2 mt-2">
                <button
                  @click="fontWeight = 300; saveFontWeight()"
                  type="button"
                  class="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  :class="{ 'bg-purple-500 text-white hover:bg-purple-600': fontWeight === 300 }"
                >
                  บาง
                </button>
                <button
                  @click="fontWeight = 400; saveFontWeight()"
                  type="button"
                  class="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  :class="{ 'bg-purple-500 text-white hover:bg-purple-600': fontWeight === 400 }"
                >
                  ปกติ
                </button>
                <button
                  @click="fontWeight = 600; saveFontWeight()"
                  type="button"
                  class="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  :class="{ 'bg-purple-500 text-white hover:bg-purple-600': fontWeight === 600 }"
                >
                  หนา
                </button>
              </div>
            </div>

            <!-- Image Spacing Setting -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                ระยะห่างรูปภาพ (Image Spacing)
              </label>
              <div class="flex items-center gap-2">
                <input
                  v-model="imagePadding"
                  @change="savePadding"
                  type="range"
                  min="5"
                  max="20"
                  step="1"
                  class="flex-1"
                />
                <span class="text-sm text-gray-600 min-w-[50px]">{{ imagePadding }}px</span>
              </div>
              <div class="flex gap-2 mt-2">
                <button
                  @click="imagePadding = 5; savePadding()"
                  type="button"
                  class="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  :class="{ 'bg-green-500 text-white hover:bg-green-600': imagePadding === 5 }"
                >
                  แน่น
                </button>
                <button
                  @click="imagePadding = 10; savePadding()"
                  type="button"
                  class="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  :class="{ 'bg-green-500 text-white hover:bg-green-600': imagePadding === 10 }"
                >
                  กลาง
                </button>
                <button
                  @click="imagePadding = 15; savePadding()"
                  type="button"
                  class="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  :class="{ 'bg-green-500 text-white hover:bg-green-600': imagePadding === 15 }"
                >
                  โล่ง
                </button>
              </div>
            </div>

            <!-- Image Border Padding Setting -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Padding ในกรอบภาพ
              </label>
              <div class="flex items-center gap-2">
                <input
                  v-model="imageBorderPadding"
                  @change="saveImageBorderPadding"
                  type="range"
                  min="0"
                  max="20"
                  step="2"
                  class="flex-1"
                />
                <span class="text-sm text-gray-600 min-w-[50px]">{{ imageBorderPadding }}px</span>
              </div>
              <div class="flex gap-2 mt-2">
                <button
                  @click="imageBorderPadding = 0; saveImageBorderPadding()"
                  type="button"
                  class="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  :class="{ 'bg-teal-500 text-white hover:bg-teal-600': imageBorderPadding === 0 }"
                >
                  ไม่มี
                </button>
                <button
                  @click="imageBorderPadding = 8; saveImageBorderPadding()"
                  type="button"
                  class="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  :class="{ 'bg-teal-500 text-white hover:bg-teal-600': imageBorderPadding === 8 }"
                >
                  ปกติ
                </button>
                <button
                  @click="imageBorderPadding = 16; saveImageBorderPadding()"
                  type="button"
                  class="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  :class="{ 'bg-teal-500 text-white hover:bg-teal-600': imageBorderPadding === 16 }"
                >
                  เยอะ
                </button>
              </div>
            </div>
          </div>

          <!-- Border Settings -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Border Weight Setting -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                ความหนาเส้นขอบ (Border Weight)
              </label>
              <div class="flex items-center gap-2">
                <input
                  v-model="borderWeight"
                  @change="saveBorderWeight"
                  type="range"
                  min="0"
                  max="5"
                  step="1"
                  class="flex-1"
                />
                <span class="text-sm text-gray-600 min-w-[50px]">{{ borderWeight }}px</span>
              </div>
              <div class="flex gap-2 mt-2">
                <button
                  @click="borderWeight = 0; saveBorderWeight()"
                  type="button"
                  class="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  :class="{ 'bg-red-500 text-white hover:bg-red-600': borderWeight === 0 }"
                >
                  ไม่มี
                </button>
                <button
                  @click="borderWeight = 1; saveBorderWeight()"
                  type="button"
                  class="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  :class="{ 'bg-red-500 text-white hover:bg-red-600': borderWeight === 1 }"
                >
                  บาง
                </button>
                <button
                  @click="borderWeight = 2; saveBorderWeight()"
                  type="button"
                  class="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  :class="{ 'bg-red-500 text-white hover:bg-red-600': borderWeight === 2 }"
                >
                  กลาง
                </button>
                <button
                  @click="borderWeight = 3; saveBorderWeight()"
                  type="button"
                  class="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  :class="{ 'bg-red-500 text-white hover:bg-red-600': borderWeight === 3 }"
                >
                  หนา
                </button>
              </div>
            </div>

            <!-- Border Radius Setting -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                มุมโค้ง (Border Radius)
              </label>
              <div class="flex items-center gap-2">
                <input
                  v-model="borderRadius"
                  @change="saveBorderRadius"
                  type="range"
                  min="0"
                  max="20"
                  step="2"
                  class="flex-1"
                />
                <span class="text-sm text-gray-600 min-w-[50px]">{{ borderRadius }}px</span>
              </div>
              <div class="flex gap-2 mt-2">
                <button
                  @click="borderRadius = 0; saveBorderRadius()"
                  type="button"
                  class="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  :class="{ 'bg-orange-500 text-white hover:bg-orange-600': borderRadius === 0 }"
                >
                  เหลี่ยม
                </button>
                <button
                  @click="borderRadius = 8; saveBorderRadius()"
                  type="button"
                  class="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  :class="{ 'bg-orange-500 text-white hover:bg-orange-600': borderRadius === 8 }"
                >
                  โค้งเล็ก
                </button>
                <button
                  @click="borderRadius = 12; saveBorderRadius()"
                  type="button"
                  class="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  :class="{ 'bg-orange-500 text-white hover:bg-orange-600': borderRadius === 12 }"
                >
                  โค้งใหญ่
                </button>
              </div>
            </div>
          </div>

          <!-- Image Upload Section -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              รูปภาพ (Images)
            </label>
            <div class="border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-gray-400 transition-colors" :style="{ padding: imagePadding + 'px' }">
              <input
                ref="fileInput"
                type="file"
                multiple
                accept="image/*"
                @change="handleImageUpload"
                class="hidden"
              />
              <div @click="$refs.fileInput.click()" class="cursor-pointer">
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <p class="mt-2 text-lg text-gray-600">คลิกเพื่อเลือกรูปภาพ</p>
                <p class="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                <p v-if="images.length > 0" class="text-sm text-green-600 mt-2">
                  เลือกรูปภาพแล้ว {{ images.length }}/8 รูป
                </p>
                <p v-if="images.length >= 8" class="text-sm text-orange-600 mt-1">
                  ⚠️ จำกัด 8 รูปต่อกระดาษ A4
                </p>
              </div>
            </div>
            
            <!-- Image Preview Section -->
            <div v-if="images.length > 0" class="mt-4">
              <div class="flex justify-between items-center mb-3">
                <h4 class="text-sm font-medium text-gray-700">ตัวอย่างรูปภาพที่เลือก ({{ images.length }} รูป):</h4>
                <button
                  @click="clearAllImages"
                  type="button"
                  class="text-sm text-red-600 hover:text-red-800 underline"
                >
                  ลบทั้งหมด
                </button>
              </div>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div v-for="(image, index) in images" :key="index" class="relative">
                  <img 
                    :src="image" 
                    :alt="`Preview ${index + 1}`" 
                    class="preview-image w-full h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    @click="removeImage(index)"
                    type="button"
                    class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 shadow-md"
                    title="ลบรูปนี้"
                  >
                    ×
                  </button>
                  <div class="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {{ index + 1 }}
                  </div>
                </div>
              </div>
              <p class="text-xs text-gray-500 mt-2">
                💡 เคล็ดลับ: คลิกเลือกรูปใหม่เพื่อเพิ่มรูปเข้าไป หรือคลิก × เพื่อลบรูปแต่ละรูป
              </p>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-center">
            <button
              type="submit"
              class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              สร้างรายงาน (Generate Report)
            </button>
          </div>
        </form>
      </div>

      <!-- Report Preview Section -->
      <div v-if="showReport" class="mt-8 bg-white rounded-lg shadow-lg p-8" id="report-content">
        <!-- Images Display Section -->
        <div v-if="images.length > 0" class="mt-8">
          <h3 class="text-xl font-semibold text-gray-800 mb-6 text-center" :style="{ fontSize: fontSize + 'px', fontWeight: fontWeight }">{{ form.name }} {{ form.lastName }} บ้านทุ่งยง {{ form.houseNumber ? 'บ้านเลขที่ ' + form.houseNumber : '' }} {{ form.mooMuNumber ? 'หมู่ที่ ' + form.mooMuNumber : '' }} {{ form.tambon ? 'ตำบล ' + form.tambon : '' }} {{ form.amphur ? 'อำเภอ ' + form.amphur : '' }} {{ form.province ? 'จังหวัด ' + form.province : '' }}</h3>
          
          <!-- Image Layout Logic -->
          <div class="image-container" :key="`images-${images.length}`">
            <div v-for="(row, rowIndex) in imageLayout.rows" :key="`row-${rowIndex}-${row.length}`" 
                 class="image-row" 
                 :class="{ 'justify-center': row.length === 1 }"
                 :style="{ 
                   gap: (imagePadding + 10) + 'px',
                   marginBottom: (imagePadding + 15) + 'px'
                 }">
              <div v-for="(image, imgIndex) in row" :key="`img-${rowIndex}-${imgIndex}-${image.slice(-20)}`" 
                   class="image-item">
                <img :src="image" 
                     :alt="`Image ${getImageNumber(rowIndex, imgIndex)}`" 
                     class="report-image"
                     :style="{
                       border: borderWeight + 'px solid #333',
                       borderRadius: borderRadius + 'px',
                       padding: imageBorderPadding + 'px'
                     }" />
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-center gap-4 mt-8">
          <button
            @click="printReport"
            class="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            📄 พิมพ์รายงาน
          </button>
          <button
            @click="saveAsPDF"
            class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            💾 บันทึก PDF
          </button>
          <button
            @click="exportToWord"
            class="bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            📝 Export Word
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'

definePageMeta({
  layout: 'default'
})

// Form data
const form = ref({
  name: '',
  lastName: '',
  houseNumber: '',
  mooMuNumber: '',
  tambon: '',
  amphur: '',
  province: ''
})

// Images array
const images = ref([])
const showReport = ref(false)

// Font size setting
const fontSize = ref(16)

// Padding setting
const imagePadding = ref(10)

// Border weight setting
const borderWeight = ref(2)

// Font weight setting
const fontWeight = ref(400)

// Border radius setting
const borderRadius = ref(0)

// Image internal padding setting
const imageBorderPadding = ref(10)

// Load saved location from localStorage
const loadSavedLocation = () => {
  if (process.client) {
    const saved = localStorage.getItem('basic-report-location')
    if (saved) {
      const location = JSON.parse(saved)
      form.value.tambon = location.tambon || ''
      form.value.amphur = location.amphur || ''
      form.value.province = location.province || ''
    }
    
    const savedFontSize = localStorage.getItem('basic-report-fontsize')
    if (savedFontSize) {
      fontSize.value = parseInt(savedFontSize)
    }
    
    const savedPadding = localStorage.getItem('basic-report-padding')
    if (savedPadding) {
      imagePadding.value = parseInt(savedPadding)
    }
    
    const savedBorderWeight = localStorage.getItem('basic-report-borderweight')
    if (savedBorderWeight) {
      borderWeight.value = parseInt(savedBorderWeight)
    }
    
    const savedFontWeight = localStorage.getItem('basic-report-fontweight')
    if (savedFontWeight) {
      fontWeight.value = parseInt(savedFontWeight)
    }
    
    const savedBorderRadius = localStorage.getItem('basic-report-borderradius')
    if (savedBorderRadius) {
      borderRadius.value = parseInt(savedBorderRadius)
    }
    
    const savedImageBorderPadding = localStorage.getItem('basic-report-imageborderpadding')
    if (savedImageBorderPadding) {
      imageBorderPadding.value = parseInt(savedImageBorderPadding)
    }
  }
}

// Save location to localStorage
const saveLocation = () => {
  if (process.client) {
    const location = {
      tambon: form.value.tambon,
      amphur: form.value.amphur,
      province: form.value.province
    }
    localStorage.setItem('basic-report-location', JSON.stringify(location))
  }
}

// Save font size to localStorage
const saveFontSize = () => {
  if (process.client) {
    localStorage.setItem('basic-report-fontsize', fontSize.value.toString())
    console.log('Font size saved:', fontSize.value)
  }
}

// Save padding to localStorage
const savePadding = () => {
  if (process.client) {
    localStorage.setItem('basic-report-padding', imagePadding.value.toString())
  }
}

// Save border weight to localStorage
const saveBorderWeight = () => {
  if (process.client) {
    localStorage.setItem('basic-report-borderweight', borderWeight.value.toString())
  }
}

// Save font weight to localStorage
const saveFontWeight = () => {
  if (process.client) {
    localStorage.setItem('basic-report-fontweight', fontWeight.value.toString())
  }
}

// Save border radius to localStorage
const saveBorderRadius = () => {
  if (process.client) {
    localStorage.setItem('basic-report-borderradius', borderRadius.value.toString())
  }
}

// Save image border padding to localStorage
const saveImageBorderPadding = () => {
  if (process.client) {
    localStorage.setItem('basic-report-imageborderpadding', imageBorderPadding.value.toString())
  }
}

// Load saved data on mount
onMounted(() => {
  loadSavedLocation()
})

// Computed property to arrange images based on count
const imageLayout = computed(() => {
  const currentImages = [...images.value] // Create reactive copy
  const count = currentImages.length
  
  console.log('Image layout recalculating, count:', count) // Debug log
  
  if (count === 0) return { rows: [] }
  if (count === 1) return { rows: [[currentImages[0]]] }
  if (count === 2) return { rows: [currentImages] }
  
  // สำหรับ 3 รูปขึ้นไป: แถวแรกแสดง 1 รูป ถ้าเป็นเลขคี่
  const rows = []
  
  if (count % 2 === 1) {
    // เลขคี่: แถวแรก 1 รูป, แถวถัดไปคู่ละ 2 รูป
    rows.push([currentImages[0]]) // แถวแรก 1 รูป
    
    for (let i = 1; i < count; i += 2) {
      const row = [currentImages[i]]
      if (i + 1 < count) {
        row.push(currentImages[i + 1])
      }
      rows.push(row)
    }
  } else {
    // เลขคู่: แบ่งเป็นคู่ๆ
    for (let i = 0; i < count; i += 2) {
      const row = [currentImages[i]]
      if (i + 1 < count) {
        row.push(currentImages[i + 1])
      }
      rows.push(row)
    }
  }
  
  return { rows }
})

// Handle image upload
const handleImageUpload = (event) => {
  const files = Array.from(event.target.files)
  
  if (files.length === 0) return
  
  const promises = files.map((file) => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          resolve(e.target.result)
        }
        reader.onerror = () => {
          console.error('Error reading file:', file.name)
          resolve(null)
        }
        reader.readAsDataURL(file)
      } else {
        resolve(null)
      }
    })
  })
  
  Promise.all(promises).then((results) => {
    const newImages = results.filter(result => result !== null)
    // เพิ่มภาพใหม่เข้าไปในรายการเดิม แต่จำกัดไม่เกิน 8 รูป
    const totalImages = [...images.value, ...newImages]
    if (totalImages.length > 8) {
      // แจ้งเตือนถ้าเกิน 8 รูป
      alert('จำกัดการแสดงผลไม่เกิน 8 รูปภาพต่อ 1 กระดาษ A4\nรูปที่เกินจะไม่ถูกเพิ่ม')
      images.value = totalImages.slice(0, 8)
    } else {
      images.value = totalImages
    }
  })
  
  // รีเซ็ต input เพื่อให้สามารถเลือกไฟล์เดิมได้อีก
  event.target.value = ''
}

// Remove image function
const removeImage = (index) => {
  images.value.splice(index, 1)
}

// Clear all images function
const clearAllImages = () => {
  images.value = []
}

// Get image number for alt text
const getImageNumber = (rowIndex, imgIndex) => {
  let count = 0
  for (let i = 0; i < rowIndex; i++) {
    count += imageLayout.value.rows[i].length
  }
  return count + imgIndex + 1
}

// Handle form submission
const handleSubmit = () => {
  showReport.value = true
  
  // Force reactivity update for images
  nextTick(() => {
    // Scroll to report section
    setTimeout(() => {
      document.getElementById('report-content')?.scrollIntoView({ 
        behavior: 'smooth' 
      })
    }, 100)
  })
}

// Function to create PDF using iframe isolation to completely avoid CSS conflicts
const createPDFFromHTML = async () => {
  // Only run on client side
  if (!process.client) return null
  
  // Dynamic import html2canvas
  const html2canvas = (await import('html2canvas')).default
  const jsPDF = (await import('jspdf')).default
  
  const reportContent = document.getElementById('report-content')
  if (!reportContent) return null
  
  // Hide buttons before capturing
  const buttons = reportContent.querySelectorAll('button')
  buttons.forEach(btn => btn.style.display = 'none')
  
  // Create an iframe to completely isolate from main page CSS
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
  
  // Wait for iframe to load
  await new Promise(resolve => {
    iframe.onload = resolve
    if (iframe.contentDocument) resolve() // Already loaded
  })
  
  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
  
  // Get text content from the report
  const titleElement = reportContent.querySelector('h3')
  const titleText = titleElement ? titleElement.textContent : ''
  
  // Get images from the report
  const images = reportContent.querySelectorAll('.report-image')
  const imageDataList = []
  for (const img of images) {
    imageDataList.push(img.src)
  }
  
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
          font-size: ${fontSize.value}px;
          font-weight: ${fontWeight.value};
          color: #333333;
          background: #ffffff;
          padding: 40px 20px 20px 20px;
          line-height: 1.4;
        }
        .title {
          text-align: center;
          font-size: ${fontSize.value + 2}px;
          font-weight: ${fontWeight.value};
          margin-bottom: 40px;
          margin-top: 20px;
          color: #333333;
        }
        .image-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: ${imagePadding.value}px;
        }
        .image-row {
          display: flex;
          justify-content: center;
          gap: ${imagePadding.value + 15}px;
          margin-bottom: ${imagePadding.value + 15}px;
        }
        .image-item {
          width: 280px;
          height: 210px;
          border: ${borderWeight.value}px solid #333333;
          border-radius: ${borderRadius.value}px;
          padding: ${imageBorderPadding.value}px;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-sizing: border-box;
        }
        .image-item img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          width: auto;
          height: auto;
        }
      </style>
    </head>
    <body>
      <div class="title">${titleText}</div>
      <div class="image-container" id="images"></div>
    </body>
    </html>
  `)
  iframeDoc.close()
  
  // Add images to iframe
  const imagesContainer = iframeDoc.getElementById('images')
  const layout = imageLayout.value
  
  layout.rows.forEach(row => {
    const rowDiv = iframeDoc.createElement('div')
    rowDiv.className = 'image-row'
    
    row.forEach(imageSrc => {
      const itemDiv = iframeDoc.createElement('div')
      itemDiv.className = 'image-item'
      
      const img = iframeDoc.createElement('img')
      img.src = imageSrc
      img.style.display = 'block'
      
      itemDiv.appendChild(img)
      rowDiv.appendChild(itemDiv)
    })
    
    imagesContainer.appendChild(rowDiv)
  })
  
  // Wait for images to load
  const iframeImages = iframeDoc.querySelectorAll('img')
  await Promise.all(Array.from(iframeImages).map(img => {
    return new Promise(resolve => {
      if (img.complete) {
        resolve()
      } else {
        img.onload = resolve
        img.onerror = resolve
      }
    })
  }))
  
  try {
    // Wait a bit for styles to apply
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Capture the iframe content as canvas
    const canvas = await html2canvas(iframeDoc.body, {
      scale: 2, // Higher resolution
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      width: 800,
      height: iframeDoc.body.scrollHeight,
      ignoreElements: (element) => {
        // Skip elements that might cause issues
        return element.tagName === 'BUTTON'
      }
    })
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })
    
    // Calculate dimensions to fit A4
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const canvasWidth = canvas.width
    const canvasHeight = canvas.height
    
    // Calculate scaling to fit page width
    const scale = pageWidth / (canvasWidth / 2) // Divide by 2 because we used scale: 2
    const scaledHeight = (canvasHeight / 2) * scale
    
    // Add image to PDF
    const imgData = canvas.toDataURL('image/png', 1.0)
    
    if (scaledHeight <= pageHeight) {
      // Fits on one page
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, scaledHeight)
    } else {
      // Need multiple pages
      let yOffset = 0
      const pageRatio = pageHeight / scaledHeight
      const sliceHeight = canvasHeight * pageRatio
      
      while (yOffset < canvasHeight) {
        const sliceCanvas = document.createElement('canvas')
        const sliceCtx = sliceCanvas.getContext('2d')
        const remainingHeight = Math.min(sliceHeight, canvasHeight - yOffset)
        
        sliceCanvas.width = canvasWidth
        sliceCanvas.height = remainingHeight
        
        // Draw slice
        sliceCtx.drawImage(canvas, 0, yOffset, canvasWidth, remainingHeight, 0, 0, canvasWidth, remainingHeight)
        
        const sliceData = sliceCanvas.toDataURL('image/png', 1.0)
        
        if (yOffset > 0) pdf.addPage()
        pdf.addImage(sliceData, 'PNG', 0, 0, pageWidth, pageHeight)
        
        yOffset += sliceHeight
      }
    }
    
    return pdf
  } finally {
    // Show buttons again
    buttons.forEach(btn => btn.style.display = '')
    // Remove iframe
    if (iframe && iframe.parentNode) {
      document.body.removeChild(iframe)
    }
  }
}

// Direct print functionality
const printReport = () => {
  if (!process.client) return
  
  if (images.value.length === 0) {
    alert('กรุณาเลือกรูปภาพก่อนพิมพ์')
    return
  }

  window.print()
}

// Direct PDF generation using HTML2Canvas for perfect quality
const saveAsPDF = async () => {
  if (!process.client) return
  
  if (images.value.length === 0) {
    alert('กรุณาเลือกรูปภาพก่อนดาวน์โหลด')
    return
  }

  try {
    const pdf = await createPDFFromHTML()
    if (pdf) {
      const filename = `${[form.value.houseNumber, form.value.mooMuNumber ? 'หมู่' + form.value.mooMuNumber : '', form.value.name, form.value.lastName].filter(Boolean).join('-')}.pdf`
      pdf.save(filename)
    }
  } catch (error) {
    console.error('Error creating PDF:', error)
    alert('เกิดข้อผิดพลาดในการสร้าง PDF: ' + error.message)
  }
}

// Export to Word functionality using HTML to Word approach
const exportToWord = async () => {
  if (!process.client) return
  
  if (images.value.length === 0) {
    alert('กรุณาเลือกรูปภาพก่อนส่งออก')
    return
  }

  try {
    // Create HTML content for Word document
    let htmlContent = `
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          @page {
            size: A4;
            margin: 50cm;
          }
          body {
            font-family: 'Sarabun';
            font-size: ${fontSize.value}px;
            font-weight: ${fontWeight.value};
            line-height: 1.4;
            color: #333;
            margin: 8px;
            padding: 8px;
          }
          .header {
            text-align: center;
            font-size: ${fontSize.value + 2}px;
            margin-bottom: 20px;
            margin-top: 10px;
          }
          .image-container {
            width: 100%;
          }
          .image-row {
            display: flex;
            justify-content: center;
            gap: ${imagePadding.value}px;
            margin-bottom: ${imagePadding.value}px;
          }
          .image-item {
            display: inline-block;
          }
          .report-image {
            width: 320px;
            height: auto;
            max-height: 240px;
            object-fit: contain;
            border: ${borderWeight.value}px solid #333;
            border-radius: ${borderRadius.value}px;
            padding: ${imageBorderPadding.value}px;
            background: white;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
        </style>
      </head>
      <body>
        <div class="header">
          ${[form.value.name, form.value.lastName, form.value.houseNumber ? 'บ้านเลขที่ ' + form.value.houseNumber : '', form.value.mooMuNumber ? 'หมู่ที่ ' + form.value.mooMuNumber : '', form.value.tambon ? 'ตำบล' + form.value.tambon : '', form.value.amphur ? 'อำเภอ' + form.value.amphur : '', form.value.province ? 'จังหวัด' + form.value.province : ''].filter(Boolean).join(' ')}
        </div>
        <div class="image-container">
    `

    // Add images using the same layout logic
    imageLayout.value.rows.forEach((row, rowIndex) => {
      htmlContent += '<div class="image-row">'
      row.forEach((image, imgIndex) => {
        htmlContent += `<div class="image-item"><img src="${image}" class="report-image" /></div>`
      })
      htmlContent += '</div>'
    })

    htmlContent += `
        </div>
      </body>
      </html>
    `

    // Create blob and download
    const blob = new Blob([htmlContent], {
      type: 'application/msword'
    })
    
    // Create download link
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${[form.value.houseNumber, form.value.mooMuNumber ? 'หมู่' + form.value.mooMuNumber : '', form.value.name, form.value.lastName].filter(Boolean).join('-')}.doc`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    
  } catch (error) {
    console.error('Error creating Word document:', error)
    console.error('Error details:', error.stack)
    alert('เกิดข้อผิดพลาดในการสร้างไฟล์ Word: ' + error.message)
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');

/* Apply Sarabun font to everything */
* {
  font-family: 'Sarabun' !important;
}

/* Sarabun Thai Font */
.sarabun-font {
  font-family: 'Sarabun' !important;
  font-size: v-bind(fontSize + 'px') !important;
  font-weight: v-bind(fontWeight) !important;
}

/* A4 paper dimensions: 210mm x 297mm */
/* 40% of A4 width = 84mm ≈ 320px (at 96 DPI) */
.report-image {
  width: 280px !important;
  height: 210px !important;
  object-fit: contain;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  background: white;
}

.image-container {
  @apply space-y-6;
  padding: 20px 0;
}

.image-row {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: v-bind((imagePadding + 15) + 'px');
  margin-bottom: v-bind((imagePadding + 15) + 'px');
}

.image-item {
  @apply flex-shrink-0;
}

/* Print styles */
@media print {
  .report-image {
    width: 6.5cm !important;
    height: 4.8cm !important;
    page-break-inside: avoid !important;
    page-break-after: avoid !important;
    page-break-before: avoid !important;
    object-fit: contain !important;
    border: ` + borderWeight.value + `px solid #333 !important;
    border-radius: ` + borderRadius.value + `px !important;
    padding: ` + imageBorderPadding.value + `px !important;
    background: white !important;
    display: inline-block !important;
    vertical-align: top !important;
    box-shadow: none !important;
  }
  
  .image-row {
    page-break-inside: avoid !important;
    page-break-after: avoid !important;
    page-break-before: avoid !important;
    margin-bottom: ` + imagePadding.value + `px !important;
    display: flex !important;
    justify-content: center !important;
    gap: ` + imagePadding.value + `px !important;
    width: 100% !important;
  }
  
  .image-container {
    page-break-inside: avoid !important;
    page-break-after: avoid !important;
    page-break-before: avoid !important;
    margin: 5px 0 !important;
  }
  
  .image-item {
    page-break-inside: avoid !important;
    page-break-after: avoid !important;
    page-break-before: avoid !important;
    display: inline-block !important;
  }
  
  button {
    display: none !important;
  }
  
  .bg-gray-50 {
    background: white !important;
  }
  
  .shadow-lg {
    box-shadow: none !important;
  }
  
  .text-center {
    text-align: center !important;
  }
  
  .font-bold {
    font-weight: bold !important;
  }
  
  .justify-center {
    justify-content: center !important;
  }
  
  @page {
    size: A4;
    margin: 1.5cm;
  }
  
  * {
    page-break-inside: avoid !important;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .report-image {
    width: 240px;
    height: 180px;
    object-fit: contain;
  }
  
  .image-row {
    @apply flex-col items-center;
  }
}

@media (max-width: 480px) {
  .report-image {
    width: 200px;
    height: 150px;
    object-fit: contain;
  }
}
</style>